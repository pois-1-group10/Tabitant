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
        if following:
            queryset = queryset.filter(follow__follower_id=following)
        if followed_by:
            queryset = queryset.filter(follow__followee_id=followed_by)
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
        queryset = self.get_queryset().annotate(
            followee_num=Follow.objects.filter(followee_id=pk).count(),
            follower_num=Follow.objects.filter(follower_id=pk).count(),
            award_ids=Award.objects.filter(user__id=pk).values('id'),   #.values以降いる？
            good_num=Good.objects.filter(post__user_id=pk).count(),
            default_post=UserProfile.objects.get(user__id=pk).default_post,
            user_profile=UserProfile.objects.get(user__id=pk),
        ).values('id','email','username','image','user_profile','follower_num','followee_num','good_num','default_post','award_ids')
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
    qyeryset = Comment.objects.all()

    def list(self, request):
        queryset = self.get_queryset()
        reply_to = request.query_params.get('reply_to', None)
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