import sys
import os
import xlwings as xw
import pandas as pd
import time
from pymongo import MongoClient

# Vérification des arguments
if len(sys.argv) < 2:
    print("Usage : python test.py <chemin_du_fichier.xlsx>")
    sys.exit(1)

chemin_entree = sys.argv[1]

# Fonction de filtre de fichiers Excel
def est_excel_valide(fichier):
    return fichier.endswith(".xlsx") and not os.path.basename(fichier).startswith("~$")

# Vérifie si fichier valide
if not os.path.isfile(chemin_entree) or not est_excel_valide(chemin_entree):
    print(f"Fichier invalide ou temporaire : {chemin_entree}")
    sys.exit(1)

# Connexion MongoDB
mongo_host = os.environ.get("MONGO_HOST", "localhost")  # Peut être défini pour Docker
mongo_port = int(os.environ.get("MONGO_PORT", 27017))
client = MongoClient(f"mongodb://{mongo_host}:{mongo_port}/")
db = client["projets"]
collection = db["test_quoi_tester"]

# Feuilles et constantes
sheet_quoitester = "Quoi tester"
sheet_meta = "Périmetre + Objectifs Projet"
decalage_lignes = -4

# Traitement du fichier
fichier = os.path.basename(chemin_entree)
print(f"\nTraitement de : {fichier}")

wb = None
app = xw.App(visible=False)
df = None
nom_projet = "projet_inconnu"

try:
    wb = app.books.open(chemin_entree)

    # Extraction du nom du projet
    if sheet_meta in [s.name for s in wb.sheets]:
        meta = wb.sheets[sheet_meta].range("C1:D20").value
        for row in meta:
            if isinstance(row, list) and str(row[0]).strip().lower() == "projet":
                nom_projet = str(row[1]).strip().lower().replace(" ", "_")
                break

    if sheet_quoitester not in [s.name for s in wb.sheets]:
        print(f"Onglet '{sheet_quoitester}' introuvable.")
        sys.exit(1)

    sheet = wb.sheets[sheet_quoitester]
    df = sheet.used_range.options(pd.DataFrame, header=1, index=False).value
    df = df.dropna(how='all').reset_index(drop=True)

    # Nettoyage des colonnes
    col0 = str(df.columns[0]).strip().lower()
    if col0 in ["none", "nan", "na"]:
        df = df.rename(columns={df.columns[0]: "Famille Technique"})
    df.iloc[:, 0] = df.iloc[:, 0].ffill()

    # Initialiser colonnes cases à cocher
    df["Demande ICP"] = "Non"
    df["Soft de Test"] = "Non"
    checkboxes = sheet.api.CheckBoxes()
    print(f"{checkboxes.Count} cases à cocher détectées.")

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

    df.dropna(axis=1, how="all", inplace=True)
    if "Commentaire" in df.columns:
        df["Commentaire"] = df["Commentaire"].fillna("RAS")
    df["projet"] = nom_projet

    # Mise à jour MongoDB
    collection.delete_many({"projet": nom_projet})
    collection.insert_many(df.to_dict("records"))
    print(f"Données mises à jour pour le projet '{nom_projet}' ({len(df)} lignes).")

except Exception as e:
    print(f"Erreur : {e}")

finally:
    time.sleep(1)
    if wb:
        try:
            wb.close()
        except Exception as e:
            print(f"Erreur fermeture Excel : {e}")
    try:
        app.quit()
    except Exception as e:
        print(f"Erreur fermeture app Excel : {e}")
