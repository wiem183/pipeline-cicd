import time
import sys
import asyncio
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import os

# Fix asyncio event loop sous Windows 
print("🚀 ETL démarre maintenant...")

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# === CONFIGURATION DYNAMIQUE ===

# Détection de l'environnement
if os.path.exists("/app/data"):
    # Environnement Docker/Linux
    watched_folder = "/app/data"
    budget_py_path = "/app/scripts/Budget.py"
    test_py_path = "/app/scripts/Test.py"
else:
    # Environnement Windows local
    watched_folder = r"C:\Users\admin\Desktop\stage\ETL_Budget_Automation\ETL_Budget_Automation\data"
    budget_py_path = r"C:\Users\admin\Desktop\stage\ETL_Budget_Automation\ETL_Budget_Automation\scripts\Budget.py"
    test_py_path = r"C:\Users\admin\Desktop\stage\ETL_Budget_Automation\ETL_Budget_Automation\scripts\Test.py"

# === SUPPRESSION DES FICHIERS TEMPORAIRES EXCEL ===
def supprimer_fichiers_temporaires_excel(dossier):
    for fichier in os.listdir(dossier):
        if fichier.startswith("~$"):
            try:
                os.remove(os.path.join(dossier, fichier))
                print(f"🧹 Fichier temporaire supprimé : {fichier}")
            except Exception as e:
                print(f"⚠️ Erreur lors de la suppression de {fichier} : {e}")

# Supprimer au démarrage
supprimer_fichiers_temporaires_excel(watched_folder)

class MonHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return

        fichier_modifie = os.path.basename(event.src_path)

        # On ne traite que les fichiers Excel
        if not fichier_modifie.endswith(".xlsx"):
            print(f"⏭️ Fichier ignoré (pas .xlsx) : {fichier_modifie}")
            return

        # Ignorer les fichiers temporaires Excel (~$...)
        if fichier_modifie.startswith("~$"):
            print(f"⏭️ Fichier temporaire ignoré : {fichier_modifie}")
            return

        print(f"\n📄 Fichier modifié détecté : {fichier_modifie}")
        full_path = os.path.join(watched_folder, fichier_modifie)

        # Exécution Budget.py
        try:
            print("▶️ Exécution Budget.py...")
            subprocess.run([sys.executable, budget_py_path, full_path], check=True)
            print("✅ Budget.py exécuté.")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erreur pendant Budget.py : {e}")

        # Exécution Test.py
        try:
            print("▶️ Exécution Test.py...")
            subprocess.run([sys.executable, test_py_path, full_path], check=True)
            print("✅ Test.py exécuté.")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erreur pendant Test.py : {e}")

        print("🏁 Traitement terminé.")

# === LANCEMENT SURVEILLANCE ===
if __name__ == "__main__":
    print(f"👀 Surveillance activée sur le dossier : {watched_folder}")
    observer = Observer()
    observer.schedule(MonHandler(), path=watched_folder, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Surveillance arrêtée par l'utilisateur.")
        observer.stop()

    observer.join()
