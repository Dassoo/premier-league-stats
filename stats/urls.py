from django.urls import path
from .views import load_stats, get_seasons

urlpatterns = [
    path('api/stats/data/', load_stats),
    path('api/seasons/', get_seasons, name="get_seasons"),
]

