#!/bin/bash

rm db.sqlite3
python3 manage.py migrate
export DJANGO_SUPERUSER_PASSWORD=hogehoge
python3 manage.py createsuperuser --username admin --email admin@example.com --noinput
python3 manage.py create_dummy_data
