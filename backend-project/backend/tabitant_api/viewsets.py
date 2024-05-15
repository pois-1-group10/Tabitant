import logging
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, F, Q, ExpressionWrapper
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
        return UserSerializer

    def list(self, request):
        queryset = self.get_queryset()
        following = request.query_params.get('following', None)
        followed_by = request.query_params.get('followed_by', None)
        #queryset.follower.get(fillower_id=request.user.id)
        if following is not None:
            queryset = queryset.filter(follower__followee_id=following)
        if followed_by:
            queryset = queryset.filter(followee__follower_id=followed_by)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        # email、username、passwordのみのデータを作成する
        partial_data = {
            'email': request.data.get('email'),
            'username': request.data.get('username'),
            'password': request.data.get('password'),
        }
        serializer = UserSerializer(data=partial_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk):
        queryset = self.get_queryset().select_related("userprofile").annotate(
            followee_num=Count("follower", distinct=True),
            follower_num=Count("followee", distinct=True),
            like_num=Count("goods", distinct=True),
        )
        queryset = queryset.filter(id=pk)
        item = get_object_or_404(queryset)
        serializer = UserDetailSerializer(item)
        return Response(serializer.data)
    
    def update(self, request):
        item = self.get_object()  #更新する対象のオブジェクト
        serializer = UserDetailSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request):
        item = self.get_object()
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'], url_path='follow')
    def follow(self, request, pk=None):
        user_to_follow = get_object_or_404(User, pk=pk)
        follower = request.user  # リクエストを送信したユーザーがフォロワーとなる
        if follower == user_to_follow:
            return Response({'error': 'You cannot follow yourself.'}, status=400)
        if Follow.objects.filter(follower=follower, followee=user_to_follow).exists():
            return Response({'error': 'You are already following this user.'}, status=400)
        Follow.objects.create(follower=follower, followee=user_to_follow)
        return Response({'message': 'Successfully followed user.'}, status=201)
    

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()

    def get_serializer_class(self):
        return UserProfileSerializer

    def retrieve(self, request, pk):
        queryset = self.get_queryset().values('id', 'user', 'bio', 'default_post')
        queryset = queryset.filter(id=pk)
        serializer = UserProfileSerializer(item, data=request.data)
        item = get_object_or_404(queryset)
        serializer = UserDetailSerializer(item)
        return Response(serializer.data)
    
    def update(self, request):
        item = self.get_object()
        serializer = UserProfileSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request):
        item = self.get_object()
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

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
            queryset = queryset.filter(latitude__range=(lat-0.01,lat+0.01))
        if lng:
            queryset = queryset.filter(longitude__range=(lng-0.01,lng+0.01))
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
            queryset = queryset.filter(latitude__range=(lat-0.01,lat+0.01))
        if lng:
            queryset = queryset.filter(longitude__range=(lng-0.01,lng+0.01))
        queryset = self.ranking_order(queryset, True)
        one = queryset.first()
        serializer = self.get_serializer(one)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info("Emotional labels have been attached.")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk):
        queryset = self.get_queryset()
        item = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(item)
        return Response(serializer.data)

    def update(self, request, pk):
        item = self.get_object()
        serializer = self.get_serializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info("Emotional labels have been reattached.")
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
        serializer = self.get_serializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path='unlike')
    def unlike(self, request, pk):
        item = self.get_object()
        good = Good.objects.filter(user=request.user, post=item)
        if not good.exists():
            return ErrorResponse("The post has not been liked.", status.HTTP_400_BAD_REQUEST)
        good.delete()
        serializer = self.get_serializer(item)
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
        serializer = self.get_serializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, url_path='undislike')
    def undislike(self, request, pk):
        item = self.get_object()
        bad = Bad.objects.filter(user=request.user, post=item)
        if not bad.exists():
            return ErrorResponse("The post has not been disliked.", status.HTTP_400_BAD_REQUEST)
        bad.delete()
        serializer = self.get_serializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return CommentUpdateSerializer
        return CommentDetailSerializer

    def list(self, request):
        queryset = self.get_queryset()
        post_id = request.query_params.get("post_id", None)
        reply_to = request.query_params.get('reply_to', None)
        if post_id is not None:
            queryset = queryset.filter(post_id=post_id)
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
