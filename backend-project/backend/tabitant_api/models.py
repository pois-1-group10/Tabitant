from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    image = models.ImageField(upload_to="%Y/%m%d/", verbose_name="アイコン")

    class Meta:
        verbose_name = "ユーザー"
        verbose_name_plural = "ユーザー"

