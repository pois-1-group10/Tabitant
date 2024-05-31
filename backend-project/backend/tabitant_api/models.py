from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    image = models.ImageField(upload_to="%Y/%m%d/", verbose_name="アイコン", null=True, blank=True)

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "ユーザー"
        verbose_name_plural = "ユーザー"

    def __str__(self):
        return self.username

class UserEmotion(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="emotions")
    emotion_ureshii = models.FloatField()
    emotion_omoshiroi = models.FloatField()
    emotion_odayaka = models.FloatField()
    emotion_shimijimi = models.FloatField()
    emotion_samishii = models.FloatField()
    emotion_ikari = models.FloatField()
    norm2 = models.FloatField()

    class Meta:
        managed = False
        db_table = 'tabitant_api_user_emotion_view'


class Prefecture(models.Model):
    name=models.CharField(max_length=15, default='')

    class Meta:
        verbose_name = "都道府県"
        verbose_name_plural = "都道府県"

    def __str__(self):
        return self.name

class Post(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE,related_name="posts")
    content_1=models.CharField(max_length=15, blank=False, default='')
    content_2=models.CharField(max_length=15, blank=False, default='')
    content_3=models.CharField(max_length=15, blank=False, default='')
    content_4=models.CharField(max_length=15, blank=False, default='')
    content_5=models.CharField(max_length=15, blank=False, default='')
    hiragana_1=models.CharField(max_length=15, blank=False, default='')
    hiragana_2=models.CharField(max_length=15, blank=False, default='')
    hiragana_3=models.CharField(max_length=15, blank=False, default='')
    hiragana_4=models.CharField(max_length=15, blank=False, default='')
    hiragana_5=models.CharField(max_length=15, blank=False, default='')
    latitude=models.FloatField(blank=True, null=True, default=0.0)
    longitude=models.FloatField(blank=True, null=True, default=0.0)
    prefecture=models.ForeignKey(Prefecture, on_delete=models.CASCADE)
    detailed_place=models.CharField(max_length=100, blank=True, null=True, default='')
    created_at=models.DateTimeField(auto_now_add=True)
    emotion_ureshii=models.IntegerField(default=0)
    emotion_omoshiroi=models.IntegerField(default=0)
    emotion_odayaka=models.IntegerField(default=0)
    emotion_shimijimi=models.IntegerField(default=0)
    emotion_samishii=models.IntegerField(default=0)
    emotion_ikari=models.IntegerField(default=0)
    tag_list = models.JSONField(default=list)

    class Meta:
        verbose_name = "投稿"
        verbose_name_plural = "投稿"

    def __str__(self):
        return f"{self.user.username}: " + " ".join([self.content_1, self.content_2, self.content_3])

class Tag(models.Model):
    name=models.CharField(max_length=15, default='')
    post=models.ManyToManyField(Post, related_name="tags")

    class Meta:
        verbose_name = "タグ"
        verbose_name_plural = "タグ"

    def __str__(self):
        return self.name

class Good(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name="goods")
    post=models.ForeignKey(Post, on_delete=models.CASCADE, related_name="goods")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"],
                name="good_unique"
            ),
        ]
        verbose_name = "Good"
        verbose_name_plural = "Good"

    def __str__(self):
        return f"{self.user.username} -> {self.post}"

class Bad(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name="bads")
    post=models.ForeignKey(Post, on_delete=models.CASCADE, related_name="bads")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"],
                name="bad_unique"
            ),
        ]
        verbose_name = "Bad"
        verbose_name_plural = "Bad"

    def __str__(self):
        return f"{self.user.username} -> {self.post}"

class Comment(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post=models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    parent_comment=models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies')
    content = models.TextField(max_length=1000, default='')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "コメント"
        verbose_name_plural = "コメント"

    def __str__(self):
        return f"{self.user.username}: {self.content[:20]}"

class GoodComment(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    comment=models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="goods")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "comment"],
                name="goodcomment_unique"
            ),
        ]
        verbose_name = "コメントへの Good"
        verbose_name_plural = "コメントへの Good"

    def __str__(self):
        return f"{self.user.username} -> {self.comment}"
    
class BadComment(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    comment=models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="bads")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "comment"],
                name="badcomment_unique"
            ),
        ]
        verbose_name = "コメントへの Bad"
        verbose_name_plural = "コメントへの Bad"

    def __str__(self):
        return f"{self.user.username} -> {self.comment}"

class Follow(models.Model):
    follower=models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    followee=models.ForeignKey(User, on_delete=models.CASCADE, related_name="followee")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "followee"],
                name="follow_unique"
            ),
        ]
        verbose_name = "フォロー"
        verbose_name_plural = "フォロー"

    def __str__(self):
        return f"{self.follower.username} -> {self.followee.username}"

class UserProfile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE, related_name="userprofile")
    bio=models.CharField(max_length=150, blank=True, default='')
    default_post=models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = "ユーザープロフィール"
        verbose_name_plural = "ユーザープロフィール"

    def __str__(self):
        return self.user.username

class Competition(models.Model):
    prefecture=models.ForeignKey(Prefecture, on_delete=models.CASCADE, related_name='competition', null=True)
    year=models.IntegerField(default=2020)
    month=models.IntegerField(default=1)
    post = models.ManyToManyField(Post, related_name="competition")

    class Meta:
        verbose_name = "大会"
        verbose_name_plural = "大会"

    def __str__(self):
        return f"{self.id}: {self.prefecture.name}大会"

class Award(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name="awards")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    compe = models.ForeignKey(Competition, on_delete=models.CASCADE, null=True)
    rank = models.IntegerField(verbose_name=_("順位"))

    class Meta:
        verbose_name = "受賞"
        verbose_name_plural = "受賞"

    def __str__(self):
        return f"{self.user.username}: {self.rank}位 ({self.compe})"
