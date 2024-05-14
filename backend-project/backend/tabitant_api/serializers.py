from rest_framework import serializers

####山本作業分
# serializers.py用

from rest_framework import serializers
from .models import Award, Competition, Prefecture

class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = ['id', 'user_id', 'tanka_id', 'compe_id', 'rank']

class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = ['id', 'prefecture_id', 'year', 'month']

class PrefectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prefecture
        fields = ['id', 'name']
