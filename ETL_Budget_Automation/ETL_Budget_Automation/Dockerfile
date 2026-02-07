FROM python:3.11-slim

# Installer dépendances système pour Excel (optionnel)
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libxss1 \
    libgconf-2-4 \
    libasound2 \
    libxshmfence-dev \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers
COPY . .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Créer dossiers data et output si pas présents
RUN mkdir -p data output

# Copier les scripts
COPY scripts/surveillance.py ./surveillance.py
COPY scripts/Budget.py ./Budget.py
COPY scripts/Test.py ./Test.py

# Lancer Python en mode unbuffered
CMD ["python", "-u", "surveillance.py"]
