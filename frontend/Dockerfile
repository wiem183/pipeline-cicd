# -------------------------
# Étape 1 : Build Angular app
# -------------------------
FROM node:18-alpine AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps


# Copier tout le reste du projet
COPY . .

# Builder l'application Angular avec le mode production
RUN npm run build -- --configuration=production

# --------------------------
# Étape 2 : Serveur Nginx
# --------------------------
FROM nginx:stable-alpine

# Copier le build Angular dans le dossier Nginx
COPY --from=builder /app/dist/pi /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Lancer Nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
