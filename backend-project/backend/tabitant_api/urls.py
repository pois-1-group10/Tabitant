from django.urls import path, include
from . import viewsets
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', viewsets.UserViewSet)  # 'users'はエンドポイントのベースURLになります
router.register(r'user_profiles', viewsets.UserProfileViewSet)
router.register(r'posts', viewsets.PostViewSet)
router.register(r'comments', viewsets.CommentViewSet)
urlpatterns = router.urls

urlpatterns = [
    path('', include(router.urls)),
]
