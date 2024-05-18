import logging
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Exists, F, OuterRef, Q, ExpressionWrapper, Value
from django.db.models.fields import IntegerField
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils import timezone

logger = logging.getLogger(__name__)

# 例外
def ErrorResponse(message, status):
    return Response({"detail": message}, status)

#クエリセットとはモデルのオブジェクトのリスト  .filterはクエリセットを返し、.getはオブジェクトを返す。


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return UserDetailSerializer
        elif self.action in ['follow', 'unfollow']:
            return UserOperationSerializer
        elif self.action in ['similar']:
            return SimilarUserSerializer
        return UserSerializer

    def list(self, request):
        queryset = self.get_queryset()
        following = request.query_params.get('following', None)
        followed_by = request.query_params.get('followed_by', None)
        if following is not None:
            queryset = queryset.filter(follower__followee_id=following)
        if followed_by:
            queryset = queryset.filter(followee__follower_id=followed_by)
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data)
    
    def update(self, request, pk, **kwargs):
        partial = kwargs.pop('partial', False)
        item = get_object_or_404(User, pk=pk)  #更新する対象のオブジェクト
        serializer = UserDetailSerializer(item, data=request.data, context={'request': request}, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        item = self.get_object()
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def similar(self, request):
        # フォローしていないユーザーの中で投稿の感情の平均ベクトルのコサイン類似度が0.8以上のユーザーを取得
        request_user_emotion = request.user.emotions
        queryset = (
            self.get_queryset().select_related("emotions").annotate(
                emotion_ureshii=F("emotions__emotion_ureshii"),
                emotion_omoshiroi=F("emotions__emotion_omoshiroi"),
                emotion_odayaka=F("emotions__emotion_odayaka"),
                emotion_shimijimi=F("emotions__emotion_shimijimi"),
                emotion_samishii=F("emotions__emotion_samishii"),
                emotion_ikari=F("emotions__emotion_ikari"),
                similarity=(
                    ( F("emotion_ureshii") * Value(request_user_emotion.emotion_ureshii)
                    + F("emotion_omoshiroi") * Value(request_user_emotion.emotion_omoshiroi)
                    + F("emotion_odayaka") * Value(request_user_emotion.emotion_odayaka)
                    + F("emotion_shimijimi") * Value(request_user_emotion.emotion_shimijimi)
                    + F("emotion_samishii") * Value(request_user_emotion.emotion_samishii)
                    + F("emotion_ikari") * Value(request_user_emotion.emotion_ikari) )
                    / ( F("emotions__norm2") * Value(request_user_emotion.norm2) )
                )
            )
            .order_by("-similarity")
            .exclude(id=request.user.id)
            .exclude(similarity__isnull=True)
            .exclude(Exists(Follow.objects.filter(follower=request.user, followee=OuterRef("id"))))
            .filter(similarity__gt=0.8)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def follow(self, request, pk):
        item = self.get_object()
        if request.user == item:
            return ErrorResponse("The follower and the followee must be different.", status.HTTP_400_BAD_REQUEST)
        if Follow.objects.filter(follower=request.user, followee=item).exists():
            return ErrorResponse("The user has already been followed.", status.HTTP_400_BAD_REQUEST)
        Follow.objects.create(follower=request.user, followee=item)
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk):
        item = self.get_object()
        follow = Follow.objects.filter(follower=request.user, followee=item)
        if not follow.exists():
            return ErrorResponse("The user has not been followed.", status.HTTP_400_BAD_REQUEST)
        follow.delete()
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def auth(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserProfileDetailSerializer
        return UserProfileUpdateSerializer

    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def retrieve(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item)
        return Response(serializer.data)

    def update(self, request, pk, **kwargs):
        partial = kwargs.pop('partial', False)
        item = self.get_object()
        serializer = self.get_serializer(item, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return PostUpdateSerializer
        elif self.action in ['like', 'unlike', 'dislike', 'undislike']:
            return PostOperationSerializer
        return PostDetailSerializer
    
    def ranking_order(self, queryset, select_newer: bool):
        queryset = queryset.annotate(
            comment_count=Count('comments'),
            good_count=Count('goods'),
        )
        if select_newer:
            queryset = queryset.annotate(
                elapsed_seconds=ExpressionWrapper(
                    (timezone.now() - F('created_at')) / 1e6,
                    output_field=IntegerField()
                )
            )
            queryset = queryset.annotate(
                popularity=F('good_count') + F('comment_count') * 2 - (F('elapsed_seconds') / 86400) ** 2
            )
        else:
            queryset = queryset.annotate(
                popularity=F('good_count') + F('comment_count') * 2
            )
        return queryset.order_by("-popularity")

    def list(self, request):
        queryset = self.get_queryset()
        lat = request.query_params.get('lat', None)
        lng = request.query_params.get('lng', None)
        search = request.query_params.get('search', None)
        tag = request.query_params.get('tag', None)
        emotion = request.query_params.get('emotion', None)
        user_id = request.query_params.get('user_id', None)
        liked_by = request.query_params.get('liked_by', None)
        compe_id = request.query_params.get('compe_id', None)
        ranking = request.query_params.get('ranking', None)
        if lat:
            queryset = queryset.filter(latitude__range=(float(lat)-0.01,float(lat)+0.01))
        if lng:
            queryset = queryset.filter(longitude__range=(float(lng)-0.01,float(lng)+0.01))
        if search:
            for word in search.split(' '):
                queryset = queryset.filter(
                    Q(content_1__contains=word) |
                    Q(content_2__contains=word) |
                    Q(content_3__contains=word) |
                    Q(content_4__contains=word) |
                    Q(content_5__contains=word)
                )
        if tag:
            queryset = queryset.filter(tags=tag)
        if emotion:
            if not emotion in ["ureshii", "omoshiroi", "odayaka", "shimijimi", "samishii", "ikari"]:
                return ErrorResponse("The emotion value is invalid.", status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(**{ f"emotion_{emotion}__gte": 1 }).order_by(f"-emotion_{emotion}")
        if user_id:
            queryset = queryset.filter(user=user_id)
        if liked_by:
            queryset = queryset.filter(goods__user=liked_by)
        if compe_id:
            queryset = queryset.filter(competition=compe_id)
        if ranking:
            queryset = self.ranking_order(queryset, False)
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(methods=["get"], detail=False, url_path='hot_one')
    def hot_one(self, request):
        queryset = self.get_queryset()
        lat = request.query_params.get('lat', None)
        lng = request.query_params.get('lng', None)
        if lat:
            queryset = queryset.filter(latitude__range=(float(lat)-0.01,float(lat)+0.01))
        if lng:
            queryset = queryset.filter(longitude__range=(float(lng)-0.01,float(lng)+0.01))
        queryset = self.ranking_order(queryset, True)
        one = queryset.first()
        serializer = self.get_serializer(one, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk):
        queryset = self.get_queryset()
        item = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data)

    def update(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        item = self.get_object()
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["post"], detail=True, url_path='like')
    def like(self, request, pk):
        item = self.get_object()
        if Good.objects.filter(user=request.user, post=item).exists():
            return ErrorResponse("The post has already been liked.", status.HTTP_400_BAD_REQUEST)
        bad = Bad.objects.filter(user=request.user, post=item)
        if bad.exists():
            bad.delete()
            logger.info("The bad object has been deleted.")
        Good.objects.create(user=request.user, post=item)
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path='unlike')
    def unlike(self, request, pk):
        item = self.get_object()
        good = Good.objects.filter(user=request.user, post=item)
        if not good.exists():
            return ErrorResponse("The post has not been liked.", status.HTTP_400_BAD_REQUEST)
        good.delete()
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path='dislike')
    def dislike(self, request, pk):
        item = self.get_object()
        if Bad.objects.filter(user=request.user, post=item).exists():
            return ErrorResponse("The post has already been disliked.", status.HTTP_400_BAD_REQUEST)
        good = Good.objects.filter(user=request.user, post=item)
        if good.exists():
            good.delete()
            logger.info("The good object has been deleted.")
        Bad.objects.create(user=request.user, post=item)
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path='undislike')
    def undislike(self, request, pk):
        item = self.get_object()
        bad = Bad.objects.filter(user=request.user, post=item)
        if not bad.exists():
            return ErrorResponse("The post has not been disliked.", status.HTTP_400_BAD_REQUEST)
        bad.delete()
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return CommentUpdateSerializer
        elif self.action in ['like', 'unlike', 'dislike', 'undislike']:
            return CommentOperationSerializer
        return CommentDetailSerializer

    def list(self, request):
        queryset = self.get_queryset()
        post_id = request.query_params.get("post_id", None)
        reply_to = request.query_params.get('reply_to', None)
        if post_id is not None:
            queryset = queryset.filter(post_id=post_id)
            if not reply_to:
                queryset = queryset.filter(parent_comment=None)
        if reply_to:
            queryset = queryset.filter(parent_comment=reply_to)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item)
        return Response(serializer.data)

    def update(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk):
        item = self.get_object()
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["post"], detail=True, url_path='like')
    def like(self, request, pk):
        item = self.get_object()
        if GoodComment.objects.filter(user=request.user, comment=item).exists():
            return ErrorResponse("The comment has already been liked.", status.HTTP_400_BAD_REQUEST)
        bad = BadComment.objects.filter(user=request.user, comment=item)
        if bad.exists():
            bad.delete()
            logger.info("The bad object has been deleted.")
        GoodComment.objects.create(user=request.user, comment=item)
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path='unlike')
    def unlike(self, request, pk):
        item = self.get_object()
        good = GoodComment.objects.filter(user=request.user, comment=item)
        if not good.exists():
            return ErrorResponse("The comment has not been liked.", status.HTTP_400_BAD_REQUEST)
        good.delete()
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(methods=["post"], detail=True, url_path='dislike')
    def dislike(self, request, pk):
        item = self.get_object()
        if BadComment.objects.filter(user=request.user, comment=item).exists():
            return ErrorResponse("The comment has already been disliked.", status.HTTP_400_BAD_REQUEST)
        good = GoodComment.objects.filter(user=request.user, comment=item)
        if good.exists():
            good.delete()
            logger.info("The bad object has been deleted.")
        BadComment.objects.create(user=request.user, comment=item)
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(methods=["post"], detail=True, url_path='undislike')
    def undislike(self, request, pk):
        item = self.get_object()
        bad = BadComment.objects.filter(user=request.user, comment=item)
        if not bad.exists():
            return ErrorResponse("The comment has not been disliked.", status.HTTP_400_BAD_REQUEST)
        bad.delete()
        serializer = self.get_serializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AwardViewSet(viewsets.ModelViewSet):
    queryset = Award.objects.all()

    def get_serializer_class(self):
        return AwardSerializer

    def list(self, request):
        queryset = self.get_queryset()
        user_id = request.query_params.get('user_id', None)
        competition_id = request.query_params.get('competition_id', None)
        if user_id:
            queryset = queryset.filter(user=user_id)
        if competition_id:
            queryset = queryset.filter(compe=competition_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item)
        return Response(serializer.data)
    
    def update(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk):
        item = self.get_object()
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CompetitionDetailSerializer
        return CompetitionUpdateSerializer

    def list(self, request):
        queryset = self.get_queryset()
        lat = request.query_params.get('lat', None)
        lng = request.query_params.get('lng', None)
        prefecture_id = request.query_params.get('prefecture_id', None)
        post_id = request.query_params.get('post_id', None)
        if (lat and not lng) or (not lat and lng):
            return ErrorResponse("Only one of lat and lng cannot be specified.", status.HTTP_400_BAD_REQUEST)
        if lat and lng:
            # TODO
            pass
        if prefecture_id:
            queryset = queryset.filter(prefecture=prefecture_id)
        if post_id:
            queryset = queryset.filter(post=post_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item)
        return Response(serializer.data)
    
    def update(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk):
        item = self.get_object()
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
