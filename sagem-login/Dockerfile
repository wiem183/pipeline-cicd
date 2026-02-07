# Étape 1 : Build avec Maven
FROM maven:3.8.6-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -Pdefault

# Étape 2 : Runtime avec Java + Python
FROM eclipse-temurin:17-jdk-focal

# Installer Python3 et dépendances pour pandas/openpyxl
RUN apt-get update && \
    apt-get install -y python3 python3-pip curl libglib2.0-0 libsm6 libxrender1 libxext6 && \
    ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Copier le jar Java
COPY --from=builder /app/target/sagem-login-*.jar app.jar

# Copier tous les scripts Python + requirements.txt
COPY scripts /app/scripts

# Installer les dépendances Python
RUN pip3 install --no-cache-dir -r /app/scripts/requirements.txt

# Créer dossier uploads
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Exposer le port
EXPOSE 8081

# Healthcheck Spring Boot
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8081/sagem/actuator/health || exit 1

# Lancement de l’application Java
ENTRYPOINT ["java", "-jar", "app.jar"]
