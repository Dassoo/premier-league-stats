from rest_framework import serializers
from .models import TeamStats

class TeamStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamStats
        fields = '__all__'  # Converting all Python db fields in JSON
