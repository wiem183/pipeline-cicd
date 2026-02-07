from pymongo import MongoClient
from datetime import datetime
import os

# Détection de l'environnement pour les chemins et MongoDB
if os.path.exists("/app/data"):
    watched_folder = "/app/data"
    mongo_url = "mongodb://mongo:27017/"
else:
    watched_folder = r"C:\Users\admin\Desktop\stage\ETL_Budget_Automation\ETL_Budget_Automation\data"
    mongo_url = "mongodb://localhost:27017/"

fichiers_cibles = ["Template_PMP_Projet_Test_Proximus_KPN.xlsx"]

client = MongoClient(mongo_url)
db = client["etl_database"]
collection_data = db["data"]

def insert_template_in_data_collection():
    chemin_template = os.path.join(watched_folder, fichiers_cibles[0])
    if not os.path.exists(chemin_template):
        print("⚠️ Fichier template introuvable.")
        return

    existing = collection_data.find_one({
        "projet": "proximus",
        "nom_fichier": fichiers_cibles[0]
    })
    if existing:
        print("ℹ️ Template déjà inséré, pas de doublon.")
        return

    try:
        with open(chemin_template, "rb") as f:
            contenu_binaire = f.read()

        doc = {
            "projet": "proximus",
            "nom_fichier": fichiers_cibles[0],
            "date_ajout": datetime.utcnow(),
            "contenu_binaire": contenu_binaire
        }
        collection_data.insert_one(doc)
        print("✅ Template inséré avec succès dans 'data'.")
    except Exception as e:
        print(f"❌ Erreur lors de l'insertion : {e}")

insert_template_in_data_collection()
