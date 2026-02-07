import os

# Détection du chemin selon environnement
if os.path.exists("/app/data"):
    watched_folder = "/app/data"
else:
    watched_folder = r"C:\Users\admin\Desktop\stage\ETL_Budget_Automation\ETL_Budget_Automation\data"

fichiers_cibles = ["Template_PMP_Projet_Test_Proximus_KPN.xlsx"]


chemin_template = os.path.join(watched_folder, fichiers_cibles[0])
print("Existe ?", os.path.exists(chemin_template))
