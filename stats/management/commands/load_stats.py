import csv
import os
from django.core.management.base import BaseCommand
from stats.models import TeamStats

class Command(BaseCommand):
    help = "Importa le statistiche delle squadre della Premier League da un file CSV"

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help="Percorso del file CSV da importare")

    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"File non trovato: {file_path}"))
            return

        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            stats_list = []
            for row in reader:
                try:
                    stat = TeamStats(
                        team=row['team'],
                        season=row['season'],
                        wins=int(float(row['wins'])),
                        losses=int(float(row['losses'])),
                        goals=int(float(row['goals'])),
                        total_yel_card=int(float(row['total_yel_card'])),
                        total_red_card=int(float(row['total_red_card'])),
                        total_scoring_att=int(float(row['total_scoring_att'])),
                        ontarget_scoring_att=int(float(row['ontarget_scoring_att'])),
                        hit_woodwork=int(float(row['hit_woodwork'])),
                        att_hd_goal=int(float(row['att_hd_goal'])),
                        total_cross=int(float(row['total_cross'])),
                        corner_taken=int(float(row['corner_taken'])),
                        touches=int(float(row['touches'])),
                        big_chance_missed=int(float(row['big_chance_missed'])) if row['big_chance_missed'] else None,
                        clearance_off_line=int(float(row['clearance_off_line'])),
                        dispossessed=int(float(row['dispossessed'])) if row['dispossessed'] else None,
                        penalty_save=int(float(row['penalty_save'])),
                        total_high_claim=int(float(row['total_high_claim'])),
                        punches=int(float(row['punches'])),
                    )
                    stats_list.append(stat)
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Errore con la riga {row}: {e}"))

            TeamStats.objects.bulk_create(stats_list)
            self.stdout.write(self.style.SUCCESS(f"Importazione completata: {len(stats_list)} record caricati."))

