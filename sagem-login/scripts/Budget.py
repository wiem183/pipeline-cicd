import sys
import pandas as pd
from pymongo import MongoClient

# === Feuilles Excel attendues ===
sheet_budget = "Budget Projet"
sheet_meta = "Périmetre + Objectifs Projet"

# === Récupération du fichier à traiter depuis les arguments ===
file_path = sys.argv[1]

client = MongoClient("mongodb://sagem-mongo:27017/")
db = client["projets"]
collection_cms = db["budget_cms"]
collection_integ = db["budget_integ"]

try:
    print(f"Traitement de : {file_path}")

    # 1. EXTRAIRE LE NOM DU PROJET
    meta = pd.read_excel(file_path, sheet_name=sheet_meta, header=None)
    meta = meta.applymap(lambda x: str(x).strip().lower() if pd.notnull(x) else x)

    ligne_projet = meta[meta.iloc[:, 2] == "projet"]
    if ligne_projet.empty:
        raise ValueError("Champ 'Projet' introuvable dans la colonne C")

    nom_projet = ligne_projet.iloc[0, 3].strip().lower().replace(" ", "_")
    print(f"Projet détecté : {nom_projet}")

    # 2. LECTURE DU BUDGET
    df_full = pd.read_excel(file_path, sheet_name=sheet_budget, header=None)
    df = df_full.iloc[5:, 4:].reset_index(drop=True)
    df.columns = df.iloc[0]
    df = df[1:].reset_index(drop=True)

    # 3. SÉPARATION CMS / INTEG (même principe mais seuil dynamique)
    total_cols = len(df.columns)
    split_index = None
    for idx, row in df.iloc[1:].iterrows():
        # Seuil = presque toutes les colonnes vides
        if row.isnull().sum() > (total_cols - 2):
            split_index = idx
            break

    if split_index is None:
        raise ValueError("Impossible de détecter la séparation entre CMS et INTEG")

    df_cms = df.iloc[:split_index].copy().reset_index(drop=True)
    df_integ = df.iloc[split_index + 1:].copy().reset_index(drop=True)

    df_cms.columns = df.columns
    df_integ.columns = df.columns

    df_cms = df_cms.iloc[1:].reset_index(drop=True)
    df_integ = df_integ.iloc[1:-2].reset_index(drop=True)

    col_cms = df_cms.columns[0]
    col_integ = df_integ.columns[0]

    df_cms[col_cms] = df_cms[col_cms].ffill()
    df_integ[col_integ] = df_integ[col_integ].ffill()

    df_cms = df_cms.fillna(0)
    df_integ = df_integ.fillna(0)

    # 4. AJOUT DU NOM DU PROJET
    df_cms["projet"] = nom_projet
    df_integ["projet"] = nom_projet

    # 5. SUPPRESSION DES DONNÉES EXISTANTES POUR CE PROJET
    deleted_cms = collection_cms.delete_many({"projet": nom_projet})
    deleted_integ = collection_integ.delete_many({"projet": nom_projet})
    print(f"{deleted_cms.deleted_count} CMS et {deleted_integ.deleted_count} INTEG supprimés pour le projet '{nom_projet}'.")

    # 6. INSERTION DANS MONGODB
    collection_cms.insert_many(df_cms.to_dict(orient="records"))
    collection_integ.insert_many(df_integ.to_dict(orient="records"))

    print(f"Données du projet '{nom_projet}' insérées avec succès dans MongoDB.")

except Exception as e:
    print(f"Erreur lors du traitement : {e}")
    sys.exit(1)
