from rest_framework import viewsets

#####山本作業分
# views.py用

from rest_framework import generics
from .models import Award, Competition, Prefecture
from .serializers import AwardSerializer, CompetitionSerializer, PrefectureSerializer

class AwardListCreateView(generics.ListCreateAPIView):
    queryset = Award.objects.all()
    serializer_class = AwardSerializer

class AwardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Award.objects.all()
    serializer_class = AwardSerializer

class CompetitionListCreateView(generics.ListCreateAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

class CompetitionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

class PrefectureListCreateView(generics.ListCreateAPIView):
    queryset = Prefecture.objects.all()
    serializer_class = PrefectureSerializer

class PrefectureDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Prefecture.objects.all()
    serializer_class = PrefectureSerializer
