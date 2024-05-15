from dj_rest_auth.serializers import LoginSerializer
from dj_rest_auth.serializers import PasswordResetSerializer
from dj_rest_auth.forms import AllAuthPasswordResetForm
from django.conf import settings
from django.contrib.auth.forms import PasswordResetForm
from rest_framework import serializers
from .models import *
import ml

class CustomLoginSerializer(LoginSerializer):
    username = None
    email = serializers.EmailField(required=True, allow_blank=False)


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", 'email', 'username', "image", "password"]
        read_only_fields = ['id', 'image']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user_id', 'bio', 'default_post_id']
        read_only_fields = ['user_id']

class UserDetailSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer()
    follower_num=serializers.IntegerField()
    followee_num=serializers.IntegerField()   
    like_num=serializers.IntegerField() 
    # default_post=serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    # awards_ids=serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = User
        fields = ['id','email','username','image','userprofile','follower_num','followee_num','like_num']
        read_only_fields = ['userprofile','follower_num','followee_num','like_num']

class PrefectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prefecture
        fields = ['id', 'name']

class PostDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    prefecture = PrefectureSerializer()
    good_count = serializers.IntegerField(source="goods.count", read_only=True)
    bad_count = serializers.IntegerField(source="bads.count", read_only=True)
    comment_count = serializers.IntegerField(source="comments.count", read_only=True)
    liked = serializers.SerializerMethodField()
    disliked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'content_1', 'content_2', 'content_3', 'content_4', 'content_5',
                  'latitude', 'longitude', 'prefecture', 'created_at', 'good_count', 'bad_count', 'comment_count', 'tags',
                  'emotion_ureshii', 'emotion_omoshiroi', 'emotion_odayaka', 'emotion_shimijimi',
                  'emotion_samishii', 'emotion_ikari', 'liked', 'disliked']

    def get_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Good.objects.filter(user=user, post=obj).exists()
        return False

    def get_disliked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Bad.objects.filter(user=user, post=obj).exists()
        return False

class PostUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user', 'content_1', 'content_2', 'content_3', 'content_4', 'content_5',
                  'latitude', 'longitude', 'prefecture', 'tags',
                  'emotion_ureshii', 'emotion_omoshiroi', 'emotion_odayaka', 'emotion_shimijimi',
                  'emotion_samishii', 'emotion_ikari']
        read_only_fields = ['emotion_ureshii', 'emotion_omoshiroi', 'emotion_odayaka', 'emotion_shimijimi',
                  'emotion_samishii', 'emotion_ikari']

    def add_emotion_labels(self, validated_data):
        content = "".join([validated_data.get(f"content_{i}") for i in range(1, 6)])
        d = ml.eval(content)
        emotions = {
            'emotion_ureshii': d["emotion.happy"],
            'emotion_omoshiroi': d["emotion.funny"],
            'emotion_odayaka': d["emotion.calm"],
            'emotion_shimijimi': d["emotion.sad"],
            'emotion_samishii': d["emotion.lonely"],
            'emotion_ikari': d["emotion.angry"],
        }
        validated_data.update(emotions)

    def create(self, validated_data):
        self.add_emotion_labels(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        self.add_emotion_labels(validated_data)
        return super().update(instance, validated_data)

class PostOperationSerializer(serializers.ModelSerializer):
    good_count = serializers.IntegerField(source="goods.count", read_only=True)
    bad_count = serializers.IntegerField(source="bads.count", read_only=True)
    liked = serializers.SerializerMethodField()
    disliked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = read_only_fields = ['id', 'user', 'content_1', 'content_2', 'content_3', 'content_4', 'content_5',
                  'latitude', 'longitude', 'prefecture', 'created_at', 'good_count', 'bad_count',
                  'emotion_ureshii', 'emotion_omoshiroi', 'emotion_odayaka', 'emotion_shimijimi',
                  'emotion_samishii', 'emotion_ikari', 'liked', 'disliked']

    def get_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Good.objects.filter(user=user, post=obj).exists()
        return False

    def get_disliked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Bad.objects.filter(user=user, post=obj).exists()
        return False

class CommentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent_comment', 'content', 'created_at', 'updated_at']

class CommentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent_comment', 'content', 'created_at', 'updated_at']

    def check_parent(self, validated_data):
        parent_comment = validated_data.get("parent_comment")
        if not parent_comment: return
        post = validated_data.get("post")
        # parent_comment の post と自身の post を比較
        if parent_comment.post != post:
            raise serializers.ValidationError("The parent comment does not belong to the same post.")
        # parent_comment には parent があってはならない
        if parent_comment.parent_comment:
            raise serializers.ValidationError("The parent comment must be a root comment.")

    def create(self, validated_data):
        self.check_parent(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        self.check_parent(validated_data)
        return super().update(instance, validated_data)

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followee']

class AwardSerializer(serializers.ModelSerializer):
    prefecture = PrefectureSerializer(source="compe.prefecture", read_only=True)
    class Meta:
        model = Award
        fields = ['id', 'user', 'post', 'compe', 'rank', 'prefecture']

class CompetitionDetailSerializer(serializers.ModelSerializer):
    prefecture = PrefectureSerializer(read_only=True)
    class Meta:
        model = Competition
        fields = ['id', 'year', 'month', 'prefecture']

class CompetitionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = ['id', 'year', 'month', 'prefecture']
