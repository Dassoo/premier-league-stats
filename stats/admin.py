from django.contrib import admin
from .models import TeamStats

@admin.register(TeamStats)
class TeamStatsAdmin(admin.ModelAdmin):
    list_display = ('team', 'season', 'wins', 'losses', 'goals')  # Visible fields
    search_fields = ('team', 'season')  # Search for team and season
