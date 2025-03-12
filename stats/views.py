from rest_framework.decorators import api_view
from .models import TeamStats
from .serializers import TeamStatsSerializer
from django.http import JsonResponse
import pandas as pd
import os

'''
class TeamStatsList(generics.ListAPIView):
    queryset = TeamStats.objects.all()
    serializer_class = TeamStatsSerializer
'''


def load_stats(request):
    csv_path = os.path.join(os.path.dirname(__file__), 'stats.csv')

    try:
        df = pd.read_csv(csv_path)

        # Fill NaN values with zeroes
        df = df.fillna(0)

        data = df.to_dict(orient="records")
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['GET'])
def get_seasons(request):
    seasons = TeamStats.objects.values_list("season", flat=True).distinct()
    return JsonResponse({"seasons": list(seasons)})