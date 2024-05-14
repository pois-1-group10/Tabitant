from dj_rest_auth.serializers import LoginSerializer
from dj_rest_auth.serializers import PasswordResetSerializer
from dj_rest_auth.forms import AllAuthPasswordResetForm
from django.conf import settings
from django.contrib.auth.forms import PasswordResetForm
from rest_framework import serializers
from .models import *

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

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    good_count = serializers.IntegerField()
    bad_count = serializers.IntegerField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'content_1', 'content_2', 'content_3', 'content_4', 'content_5',
                  'latitude', 'longitude', 'prefecture', 'good_count', 'bad_count']
        
class PostHotSerializer(serializers.ModelSerializer):

    class Meta:
        model= Post
        fields = ['id', 'user', 'user_image', 'user_name','content_1', 'content_2', 'content_3', 'content_4', 'content_5']
        
class PostDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post

class GoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Good
        fields = ['id', 'user_id', 'post_id']

class BadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bad
        fields = ['id', 'user_id', 'post_id']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'post','parent_comment','content','created_at','updated_at']

class CommentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'post','parent_comment','content','created_at','updated_at']

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followee']

class PrefectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prefecture
        fields = ['id', 'name']

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
