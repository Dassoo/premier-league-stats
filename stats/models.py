from django.db import models

class TeamStats(models.Model):
    team = models.CharField(max_length=100)
    season = models.CharField(max_length=9)  # Ex. "2006-2007"
    wins = models.IntegerField()
    losses = models.IntegerField()
    goals = models.IntegerField()
    total_yel_card = models.IntegerField()
    total_red_card = models.IntegerField()
    total_scoring_att = models.IntegerField()
    ontarget_scoring_att = models.IntegerField()
    hit_woodwork = models.IntegerField()
    att_hd_goal = models.IntegerField()
    total_cross = models.IntegerField()
    corner_taken = models.IntegerField()
    touches = models.IntegerField()
    big_chance_missed = models.IntegerField(null=True, blank=True)
    clearance_off_line = models.IntegerField()
    dispossessed = models.IntegerField(null=True, blank=True)
    penalty_save = models.IntegerField()
    total_high_claim = models.IntegerField()
    punches = models.IntegerField()

    def __str__(self):
        return f"{self.team} - {self.season}"

