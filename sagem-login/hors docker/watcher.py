# watcher.py
import os
import time
import subprocess

UPLOAD_DIR = "./uploads"
ALREADY_PROCESSED = set()

def run_test_py(fichier):
    print(f"[watcher] ▶ Lancement de test.py sur {fichier}")
    try:
        result = subprocess.run(["python", "test.py", fichier], capture_output=True, text=True)
        print(result.stdout)
        if result.returncode != 0:
            print("[watcher] ❌ Erreur lors du traitement.")
        else:
            print("[watcher] ✅ Traitement terminé.")
    except Exception as e:
        print(f"[watcher] ⚠️ Exception : {e}")

def main():
    print(f"[watcher] 📂 Surveillance de '{UPLOAD_DIR}'...")
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    while True:
        fichiers = os.listdir(UPLOAD_DIR)
        for nom in fichiers:
            chemin = os.path.join(UPLOAD_DIR, nom)
            if chemin not in ALREADY_PROCESSED and nom.endswith(".xlsx"):
                ALREADY_PROCESSED.add(chemin)
                run_test_py(chemin)

        time.sleep(2)

if __name__ == "__main__":
    main()
