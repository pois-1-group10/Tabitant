from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import *

User = get_user_model()

# Register your models here.
admin.site.register(User)
admin.site.register(Prefecture)
admin.site.register(Post)
admin.site.register(Tag)
admin.site.register(Good)
admin.site.register(Bad)
admin.site.register(Comment)
admin.site.register(GoodComment)
admin.site.register(Follow)
admin.site.register(UserProfile)
admin.site.register(Competition)
admin.site.register(Award)
