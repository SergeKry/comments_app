#!/bin/sh
set -e

# Run migrations
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Start server
exec python manage.py runserver 0.0.0.0:8000