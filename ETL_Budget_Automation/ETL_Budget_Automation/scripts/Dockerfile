FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier dossier scripts (contient surveillance.py, Budget.py, Test.py)
COPY scripts ./scripts

CMD ["python", "/app/scripts/surveillance.py"]
