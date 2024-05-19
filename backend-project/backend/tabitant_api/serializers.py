import logging
from dj_rest_auth.serializers import LoginSerializer
from dj_rest_auth.serializers import PasswordResetSerializer
from dj_rest_auth.forms import AllAuthPasswordResetForm
from django.conf import settings
from django.contrib.auth.forms import PasswordResetForm
from rest_framework import serializers
from .models import *
import ml

logger = logging.getLogger(__name__)

class CustomLoginSerializer(LoginSerializer):
    username = None
    email = serializers.EmailField(required=True, allow_blank=False)

class PrefectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prefecture
        fields = ['id', 'name']

class CompetitionDetailSerializer(serializers.ModelSerializer):
    prefecture = PrefectureSerializer(read_only=True)
    class Meta:
        model = Competition
        fields = ['id', 'year', 'month', 'prefecture']

class AwardSerializer(serializers.ModelSerializer):
    compe = CompetitionDetailSerializer(read_only=True)
    class Meta:
        model = Award
        fields = ['id', 'user', 'post', 'compe', 'rank']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    followed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", 'email', 'username', "image", "password", "followed"]
        read_only_fields = ['id', 'image']

    def get_followed(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Follow.objects.filter(follower=user, followee=obj).exists()
        return False

class DefaultPostSerializer(serializers.ModelSerializer):
    prefecture = PrefectureSerializer()
    tags = serializers.SlugRelatedField("name", queryset=Tag.objects.all(), many=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'content_1', 'content_2', 'content_3', 'content_4', 'content_5',
                  'latitude', 'longitude', 'prefecture', 'created_at', 'tags',
                  'emotion_ureshii', 'emotion_omoshiroi', 'emotion_odayaka', 'emotion_shimijimi',
                  'emotion_samishii', 'emotion_ikari']

class UserProfileDetailSerializer(serializers.ModelSerializer):
    default_post = DefaultPostSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'default_post']

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'default_post']
        read_only_fields = ['user']

    def check_owner(self, instance, validated_data):
        default_post = validated_data.get("default_post")
        if not default_post: return
        if instance.user != default_post.user:
            raise serializers.ValidationError("The owner of default post and profile must be the same user.")

    def update(self, instance, validated_data):
        self.check_owner(instance, validated_data)
        return super().update(instance, validated_data)

class UserDetailSerializer(serializers.ModelSerializer):
    userprofile = UserProfileDetailSerializer(read_only=True)
    follower_num = serializers.IntegerField(source="followee.count", read_only=True)
    followee_num = serializers.IntegerField(source="follower.count", read_only=True)
    like_num = serializers.IntegerField(source="goods.count", read_only=True)
    followed = serializers.SerializerMethodField()
    awards = AwardSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'image', 'userprofile', 'follower_num', 'followee_num', 'like_num',
                  'followed', 'awards']

    def get_followed(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Follow.objects.filter(follower=user, followee=obj).exists()
        return False

class SimilarUserSerializer(serializers.ModelSerializer):
    followed = serializers.SerializerMethodField()
    emotion_ureshii = serializers.IntegerField()
    emotion_omoshiroi = serializers.IntegerField()
    emotion_samishii = serializers.IntegerField()
    emotion_shimijimi = serializers.IntegerField()
    emotion_odayaka = serializers.IntegerField()
    emotion_ikari = serializers.IntegerField()
    similarity = serializers.FloatField()

    class Meta:
        model = User
        fields = ['id', 'username', 'image', 'followed', 'emotion_ureshii', 'emotion_omoshiroi', 'emotion_samishii', 
                  'emotion_shimijimi', 'emotion_odayaka', 'emotion_ikari', 'similarity']
    
    def get_followed(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Follow.objects.filter(follower=user, followee=obj).exists()
        return False

class UserOperationSerializer(serializers.ModelSerializer):
    followed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = read_only_fields = ["id", 'email', 'username', "image", "followed"]

    def get_followed(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return Follow.objects.filter(follower=user, followee=obj).exists()
        return False

class PostDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    prefecture = PrefectureSerializer()
    good_count = serializers.IntegerField(source="goods.count", read_only=True)
    bad_count = serializers.IntegerField(source="bads.count", read_only=True)
    comment_count = serializers.IntegerField(source="comments.count", read_only=True)
    liked = serializers.SerializerMethodField()
    disliked = serializers.SerializerMethodField()
    tags = serializers.SlugRelatedField("name", queryset=Tag.objects.all(), many=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'content_1', 'content_2', 'content_3', 'content_4', 'content_5', 
                  'hiragana_1', 'hiragana_2', 'hiragana_3', 'hiragana_4', 'hiragana_5',
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
    #tag_list = serializers.ListField(child=serializers.CharField())
    prefecture = serializers.SlugRelatedField("name", queryset=Prefecture.objects.all())
    class Meta:
        model = Post
        fields = ['id', 'user', 'content_1', 'content_2', 'content_3', 'content_4', 'content_5',
                  'hiragana_1', 'hiragana_2', 'hiragana_3', 'hiragana_4', 'hiragana_5',
                  'latitude', 'longitude', 'prefecture', 'tag_list',
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
        logger.info("Emotional labels have been attached.")

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
    user = UserSerializer()
    reply_count = serializers.IntegerField(source="replies.count", read_only=True)
    good_count = serializers.IntegerField(source="goods.count", read_only=True)
    liked = serializers.SerializerMethodField()
    bad_count = serializers.IntegerField(source="bads.count", read_only=True)
    disliked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'parent_comment', 'content', 'reply_count', 'good_count', 'liked', 'bad_count', 'disliked', 'created_at', 'updated_at']

    def get_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return GoodComment.objects.filter(user=user, comment=obj).exists()
        return False
    
    def get_disliked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return BadComment.objects.filter(user=user, comment=obj).exists()
        return False

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

class CommentOperationSerializer(serializers.ModelSerializer):
    good_count = serializers.IntegerField(source="goods.count", read_only=True)
    liked = serializers.SerializerMethodField()
    bad_count = serializers.IntegerField(source="bads.count", read_only=True)
    disliked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = read_only_fields = ['id', 'user', 'post', 'parent_comment', 'content', 'good_count',
                                     'liked', 'bad_count', 'disliked','created_at', 'updated_at']

    def get_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return GoodComment.objects.filter(user=user, comment=obj).exists()
        return False
    
    def get_disliked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return BadComment.objects.filter(user=user, comment=obj).exists()
        return False

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followee']


class CompetitionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = ['id', 'year', 'month', 'prefecture']