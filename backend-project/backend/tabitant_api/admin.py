from django.contrib import admin
from .models import User, UserProfile, Post, Prefecture, Comment

# Register your models here.
admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Prefecture)
