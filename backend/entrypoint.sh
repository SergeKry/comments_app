#!/bin/sh
set -e

# Run migrations
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Start server
exec daphne -b 0.0.0.0 -p 8000 Comments.asgi:application