import pandas as pd
from pymongo import MongoClient
import os

# --- Détection environnement ---
if os.path.exists("/app/data"):
    data_folder = "/app/data"
    mongo_url = "mongodb://mongo:27017/"  # adapte si MongoDB est dans un conteneur nommé mongo
else:
    data_folder = r"C:\Users\admin\Desktop\stage\ETL_Budget_Automation\ETL_Budget_Automation\data"
    mongo_url = "mongodb://localhost:27017/"

sheet_budget = "Budget Projet"
sheet_meta = "Périmetre + Objectifs Projet"

# Connexion MongoDB
client = MongoClient(mongo_url)
db = client["projets"]
collection_cms = db["budget_cms"]
collection_integ = db["budget_integ"]

# Nettoyage des anciennes données (optionnel)
collection_cms.delete_many({})
collection_integ.delete_many({})

# Parcours des fichiers Excel
for filename in os.listdir(data_folder):
    if filename.endswith(".xlsx"):
        filepath = os.path.join(data_folder, filename)
        print(f"\n📂 Traitement de : {filename}")

        try:
            # 1. EXTRAIRE LE NOM DU PROJET
            meta = pd.read_excel(filepath, sheet_name=sheet_meta, header=None)

            # Nettoyage des valeurs : minuscules + strip
            meta = meta.applymap(lambda x: str(x).strip().lower() if pd.notnull(x) else x)

            ligne_projet = meta[meta.iloc[:, 2] == "projet"]
            if ligne_projet.empty:
                raise ValueError("Champ 'Projet' introuvable dans la colonne C")

            nom_projet = ligne_projet.iloc[0, 3].strip().lower().replace(" ", "_")
            print(f"🔖 Projet détecté : {nom_projet}")

            # 2. LECTURE ET STRUCTURATION DES DONNÉES BUDGET
            df_full = pd.read_excel(filepath, sheet_name=sheet_budget, header=None)
            df = df_full.iloc[5:, 4:].reset_index(drop=True)
            df.columns = df.iloc[0]
            df = df[1:].reset_index(drop=True)

            # 3. DÉCOUPAGE CMS / INTEG
            split_index = None
            for idx, row in df.iloc[1:].iterrows():
                if row.isnull().sum() > 6:
                    split_index = idx
                    break

            if split_index is None:
                raise ValueError("❌ Aucune ligne avec >6 NaN pour séparer CMS/INTEG")

            df_cms = df.iloc[:split_index].copy().reset_index(drop=True)
            df_integ = df.iloc[split_index+1:].copy().reset_index(drop=True)

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

            # 4. AJOUT DU NOM DU PROJET DANS CHAQUE ENREGISTREMENT
            df_cms["projet"] = nom_projet
            df_integ["projet"] = nom_projet

            # 5. INSERTION DANS MONGODB
            collection_cms.insert_many(df_cms.to_dict(orient="records"))
            collection_integ.insert_many(df_integ.to_dict(orient="records"))

            print(f"✅ Données du projet '{nom_projet}' insérées dans MongoDB.")

        except Exception as e:
            print(f"⚠️ Erreur pour '{filename}' : {e}")
