from rest_framework import serializers
from .models import *
    
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", 'email', 'username', "image", "password"]
        read_only_fields = ['id', 'image']

class UserDetailSerializer(serializers.ModelSerializer):
    user_profile_id=serializers.IntegerField()
    follower_num=serializers.IntegerField()
    followee_num=serializers.IntegerField()   
    like_num=serializers.IntegerField() 
    default_post=serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    awards_ids=serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = User
        fields = ['id','email','username','image','user_profile','follower_num','followee_num','like_num','default_post','award_ids']
        read_only_fields = ['user_profile','follower_num','followee_num','like_num','default_post','award_ids']

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
        fields = ['id', 'user_id', 'post_id','parent_comment_id','content','created_at','updated_at']

class CommentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user_id', 'post_id','parent_comment_id','content','created_at','updated_at']

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower_id', 'followee_id']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user_id', 'bio', 'default_post_id']
        read_only_fields = ['user_id']