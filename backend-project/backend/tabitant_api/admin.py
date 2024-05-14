from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import User, UserProfile, Post, Prefecture, Comment, Award, Competition, Prefecture

User = get_user_model()

# Register your models here.
admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Award)
admin.site.register(Competition)
admin.site.register(Prefecture)
