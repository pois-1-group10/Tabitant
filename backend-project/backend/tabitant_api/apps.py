import os
from django.apps import AppConfig
import ml

class TabitantApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tabitant_api'

    def ready(self):
        if os.environ.get('RUN_MAIN', None) != 'true':
            return
        ml.load()
