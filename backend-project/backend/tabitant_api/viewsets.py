from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import F

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
        return PostSerializer

    def list(self, request):
        queryset = self.get_queryset()
        lat = request.query_params.get('lat', None)
        lng = request.query_params.get('lng', None)
        tag=request.query_params.get('tag', None)
        emo=request.query_params.get('emotion', None)
        user=request.query_params.get('user_id', None)
        if lat:
            queryset = queryset.filter(latitude__range=(lat-0.01,lat+0.01))
        if lng:
            queryset = queryset.filter(longitude__range=(lng-0.01,lng+0.01))
        if tag:
            queryset = queryset.filter(tag__in=F("tags__"))    #??
        if emo:
            queryset = queryset.filter(emotion=Post.emotion_ikari)   #??
        if user:
            queryset = queryset.filter(user__user_id=user)
        queryset = queryset.annotate(
            user_image=F("user__image"),
            user_name=F("user__username"),
            good_count=Count("good"),
            bad_count=Count("bad"),
        )
        serializer = PostSerializer(queryset, many=True)
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
        queryset = queryset.values('id', 'user', 'content_1', 'content_2', 'content_3', 'content_4', 'content_5')     
        queryset = queryset.annotate(
            user_image=F("user__image"),
            user_name=F("user__username"),
        )  
        serializer = PostHotSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk):
        queryset = self.get_queryset().annotate(
            image=F("user__image"),
            username=User.objects.get(id=queryset.get(id=pk).user_id).username,   #F("user__username"),
            good_count=Good.objects.filter(post__post_id=pk).count(),
            bad_count=Bad.objects.filter(post__post_id=pk).count(),
            tags=list(Tag.objects.filter(post=pk).values('id')),     #???
            liked=Good.objects.filter(user=request.user, post=pk).exists(),  #post=pkでいいのか
            disliked=Bad.objects.filter(user=request.user, post=pk).exists(),  #post=pkでいいのか
        ).values('id','user','username','image','content1','content_2', 'content_3', 'content_4', 'content_5',
                 'latitude', 'longitude', 'prefecture','detailed_place', 'emotion_ureshii','emotion_omoshiroi','emotion_odayaka','emotion_shimijimi',
                  'emotion_samishii', 'emotion_ikari','good_count', 'bad_count', 'tags', 'liked', 'disliked')     
        queryset = queryset.filter(id=pk)
        item = get_object_or_404(queryset)
        serializer = PostDetailSerializer(item)
        return Response(serializer.data)
    
    def update(self, request):
        item = self.get_object()  #更新する対象のオブジェクト
        serializer = PostDetailSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request):
        item = self.get_object()
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
    @action(methods=["post"], detail=True, url_path='like')
    def like(self, request, pk):
        serializer = GoodSerializer(data=request.data)
        Good.objects.create(user=request.user, post=pk)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(methods=["delete"], detail=True, url_path='like')
    def unlike(self, request, pk):
        Good.objects.delete(user=request.user, post=pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(methods=["post"], detail=True, url_path='dislike')
    def dislike(self, request, pk):
        serializer = PostSerializer(data=request.data)
        Bad.objects.create(user=request.user, post=pk)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["delete"], detail=True, url_path='dislike')
    def undislike(self, request, pk):
        Bad.objects.delete(user=request.user, post=pk)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()

    def get_serializer_class(self):
        return CommentSerializer

    def list(self, request):
        queryset = self.get_queryset()
        post_id = request.query_params.get("post_id", None)
        reply_to = request.query_params.get('reply_to', None)
        if post_id is not None:
            queryset = queryset.filter(post_id=post_id)
        if reply_to:
            queryset = queryset.filter(parent_comment=reply_to)  #parent_comment=reply_toでいいのか
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):  #???
        serializer = CommentSerializer(data=request.data)
        post_id = request.query_params.get('post_id', None)
        reply_to = request.query_params.get('reply_to', None)
        partial_data = {
            'post_id': post_id,
            'parent_comment_id': reply_to,
        }
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk):
        queryset = Comment.objects.all()
        queryset = queryset.filter(id=pk)
        item = get_object_or_404(queryset)
        serializer = CommentDetailSerializer(item)
        return Response(serializer.data)

    def update(self, request):
        queryset = self.get_object()
        serializer = CommentDetailSerializer(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request):
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
