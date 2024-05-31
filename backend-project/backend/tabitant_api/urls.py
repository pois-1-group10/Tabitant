from django.urls import path, include
from . import viewsets
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', viewsets.UserViewSet, basename="user")  # 'users'はエンドポイントのベースURLになります
router.register(r'user_profiles', viewsets.UserProfileViewSet, basename="user_profile")
router.register(r'posts', viewsets.PostViewSet, basename="post")
router.register(r'comments', viewsets.CommentViewSet, basename="comment")
router.register(r'awards', viewsets.AwardViewSet, basename="award")
router.register(r'competitions', viewsets.CompetitionViewSet, basename="competition")
urlpatterns = router.urls

urlpatterns = [
    path('', include(router.urls)),
]
