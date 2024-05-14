from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.
class User(AbstractUser):
    image = models.ImageField(upload_to="%Y/%m%d/", verbose_name="アイコン", null=True, blank=True)

    class Meta:
        verbose_name = "ユーザー"
        verbose_name_plural = "ユーザー"

class Prefecture(models.Model):
    name=models.CharField(max_length=15, default='')

    def __str__(self):
        return self.name

class Post(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="posts")  #逆引きによりユーザーが投稿した全てのポスト
    content_1=models.CharField(max_length=15, blank=False, default='')
    content_2=models.CharField(max_length=15, blank=False, default='')
    content_3=models.CharField(max_length=15, blank=False, default='')
    content_4=models.CharField(max_length=15, blank=False, default='')
    content_5=models.CharField(max_length=15, blank=False, default='')
    latitude=models.FloatField(blank=True, null=True, default=0.0)
    longitude=models.FloatField(blank=True, null=True, default=0.0)
    prefecture=models.ForeignKey(Prefecture, on_delete=models.CASCADE)
    detailed_place=models.CharField(max_length=15, blank=True, null=True, default='')
    created_at=models.DateTimeField(auto_now_add=True)
    emotion_ureshii=models.IntegerField(default=0)
    emotion_omoshiroi=models.IntegerField(default=0)
    emotion_odayaka=models.IntegerField(default=0)
    emotion_shimijimi=models.IntegerField(default=0)
    emotion_samishii=models.IntegerField(default=0)
    emotion_ikari=models.IntegerField(default=0)

class Tag(models.Model):
    name=models.CharField(max_length=15, default='')
    post=models.ManyToManyField(Post, related_name="tags")

class Good(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name="goods")   #逆引きによりgoodテーブルにあるユーザのリストをゲット
    post=models.ForeignKey(Post, on_delete=models.CASCADE)

class Bad(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    post=models.ForeignKey(Post, on_delete=models.CASCADE)

class Comment(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    post=models.ForeignKey(Post, on_delete=models.CASCADE)
    parent_comment=models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies')
    content = models.TextField(max_length=1000, default='')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now_add=True)

class GoodComment(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    comment=models.ForeignKey(Comment, on_delete=models.CASCADE)

class Follow(models.Model):
    follower=models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    followee=models.ForeignKey(User, on_delete=models.CASCADE, related_name="followee")

    class Meta:
        unique_together = ['follower_id', 'followee_id']

class UserProfile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE, related_name="userprofile")
    bio=models.CharField(max_length=150, blank=True, default='')
    default_post=models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)

class Competition(models.Model):
    prefecture=models.ForeignKey(Prefecture, on_delete=models.CASCADE, related_name='competition', null=True)
    year=models.IntegerField(default=2020)
    month=models.IntegerField(default=1)
    post = models.ManyToManyField(Post, related_name="competition")

    class Meta:
        verbose_name = "競技"
        verbose_name_plural = "競技一覧"

    def __str__(self):
        return f"Competition {self.id}"

class Award(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    compe = models.ForeignKey(Competition, on_delete=models.CASCADE, null=True)
    rank = models.IntegerField(verbose_name=_("順位"))

    class Meta:
        verbose_name = "受賞"
        verbose_name_plural = "受賞一覧"

    def __str__(self):
        return f"Award {self.id}"
