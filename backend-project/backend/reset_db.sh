#!/bin/bash

rm db.sqlite3
python3 manage.py migrate
python3 manage.py createsuperuser --email admin@example.com
