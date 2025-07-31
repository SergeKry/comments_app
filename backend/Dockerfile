FROM python:3.11-slim

WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt daphne

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh