import sys
import pandas as pd
from pymongo import MongoClient
import os

def main(file_path):
    if not os.path.isfile(file_path):
        print(f"Erreur : Fichier non trouvé : {file_path}")
        sys.exit(1)

    print(f"Traitement du fichier : {file_path}")

    # Connexion MongoDB
    client = MongoClient("mongodb://sagem-mongo:27017/")

    db = client["projets"]
    collection = db["planning"]

    filename = os.path.basename(file_path)
    project_name = extract_project_name(filename)

    try:
        # Lecture du fichier Excel
        df = pd.read_excel(file_path, sheet_name=0)

        # Conversion des colonnes de type date en format ISO
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].dt.strftime('%Y-%m-%d')

        # Ajout de la colonne projet
        df['projet'] = project_name

        # Nettoyage des anciennes données
        deleted = collection.delete_many({"projet": project_name})
        print(f"{deleted.deleted_count} documents supprimés pour {project_name}")

        # Insertion dans MongoDB
        records = df.to_dict(orient="records")
        if records:
            collection.insert_many(records)
            print(f"{len(records)} lignes insérées dans MongoDB pour {project_name}")
        else:
            print("Aucune donnée à insérer.")

    except Exception as e:
        print(f"Erreur : {e}")
        sys.exit(1)

def extract_project_name(filename):
    """ Extraire le nom du projet avant le premier underscore ou point """
    if "_" in filename:
        return filename.split("_")[0].strip().lower()
    elif "." in filename:
        return filename.split(".")[0].strip().lower()
    return filename.strip().lower()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage : python planning_to_mongo.py <chemin_du_fichier>")
        sys.exit(1)

    file_path = sys.argv[1]
    main(file_path)
