# test.py

import sys
import os
import xlwings as xw
import pandas as pd
import time
from pymongo import MongoClient

# ----------------------------
# ✅ Vérification des arguments
# ----------------------------
if len(sys.argv) < 2:
    print("❌ Usage : python test.py <chemin_du_dossier_ou_fichier.xlsx>")
    sys.exit(1)

chemin_entree = sys.argv[1]

# Vérifie si c'est un fichier ou un dossier
if os.path.isfile(chemin_entree) and chemin_entree.endswith(".xlsx"):
    fichiers_excel = [chemin_entree]
elif os.path.isdir(chemin_entree):
    fichiers_excel = [
        os.path.join(chemin_entree, f)
        for f in os.listdir(chemin_entree)
        if f.endswith(".xlsx") and not f.startswith("~$")
    ]
else:
    print(f"❌ Fichier ou dossier invalide : {chemin_entree}")
    sys.exit(1)

# ----------------------------
# ✅ Constantes
# ----------------------------
sheet_quoitester = "Quoi tester"
sheet_meta = "Périmetre + Objectifs Projet"
decalage_lignes = -4

# ----------------------------
# ✅ Connexion MongoDB (local)
# ----------------------------
client = MongoClient("mongodb://sagem-mongo:27017/")
db = client["projets"]
collection = db["test_quoi_tester"]
collection.delete_many({})  # Nettoyage de la collection

# ----------------------------
# ✅ Parcours des fichiers Excel
# ----------------------------
for chemin_fichier in fichiers_excel:
    fichier = os.path.basename(chemin_fichier)
    print(f"\n📁 Traitement de : {fichier}")

    wb = None
    app = xw.App(visible=False)
    df = None
    nom_projet = "projet_inconnu"

    try:
        wb = app.books.open(chemin_fichier)

        # --- Récupération du nom du projet ---
        if sheet_meta in [s.name for s in wb.sheets]:
            meta = wb.sheets[sheet_meta].range("C1:D20").value
            for row in meta:
                if isinstance(row, list) and str(row[0]).strip().lower() == "projet":
                    nom_projet = str(row[1]).strip().lower().replace(" ", "_")
                    break

        # --- Lecture de la feuille "Quoi tester" ---
        if sheet_quoitester not in [s.name for s in wb.sheets]:
            print(f"❌ Onglet '{sheet_quoitester}' introuvable.")
            continue

        sheet = wb.sheets[sheet_quoitester]
        df = sheet.used_range.options(pd.DataFrame, header=1, index=False).value
        df = df.dropna(how='all').reset_index(drop=True)

        # --- Nettoyage des colonnes ---
        col0 = str(df.columns[0]).strip().lower()
        if col0 in ["none", "nan", "na"]:
            df = df.rename(columns={df.columns[0]: "Famille Technique"})
        df.iloc[:, 0] = df.iloc[:, 0].ffill()

        # Ajout des colonnes à remplir depuis les checkboxes
        df["Demande ICP"] = "Non"
        df["Soft de Test"] = "Non"

        checkboxes = sheet.api.CheckBoxes()
        print(f"✅ {checkboxes.Count} cases à cocher détectées.")

        for i in range(1, checkboxes.Count + 1):
            cb = checkboxes.Item(i)
            row = cb.TopLeftCell.Row
            col = cb.TopLeftCell.Column
            try:
                val = cb.Value
            except:
                val = 0

            ligne_df = row + decalage_lignes - 1
            if 0 <= ligne_df < len(df):
                if col == 6:
                    df.at[ligne_df, "Demande ICP"] = "Oui" if val == 1 else "Non"
                elif col == 7:
                    df.at[ligne_df, "Soft de Test"] = "Oui" if val == 1 else "Non"

        # --- Nettoyage final ---
        colonnes_vides = df.columns[df.isnull().all()]
        df.drop(columns=colonnes_vides, inplace=True)

        if "Commentaire" in df.columns:
            df["Commentaire"] = df["Commentaire"].fillna("Pas de commentaire")

        # Ajout du nom de projet
        df["projet"] = nom_projet

        # Insertion dans MongoDB
        collection.insert_many(df.to_dict("records"))
        print(f"📌 Données insérées pour projet '{nom_projet}'")

    except Exception as e:
        print(f"⚠️ Erreur lors du traitement de {fichier} : {e}")

    finally:
        time.sleep(1)
        if wb:
            try:
                wb.close()
            except Exception as e:
                print(f"⚠️ Erreur fermeture Excel : {e}")
        try:
            app.quit()
        except Exception as e:
            print(f"⚠️ Erreur fermeture app Excel : {e}")
