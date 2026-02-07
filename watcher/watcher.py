import os
import time
import subprocess
import hashlib

# Chemin du dossier uploads (relatif ou absolu)
UPLOAD_DIR = os.path.abspath(r"..\sagem-login\uploads")
processed_files_hash = {}

def file_hash(path):
    try:
        with open(path, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

def run_test_py(fichier):
    print(f"[watcher] Lancement de test.py sur {fichier}")
    try:
        result = subprocess.run(
            ["python", "test.py", fichier],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace"
        )
        print(result.stdout)
        if result.returncode != 0:
            print("[watcher] Erreur lors du traitement.")
            print("[watcher] stderr:\n" + result.stderr)
        else:
            print("[watcher] Traitement terminé.")
    except Exception as e:
        print(f"[watcher] Exception : {e}")

def main():
    print(f"[watcher] Surveillance de '{UPLOAD_DIR}'...")
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    while True:
        try:
            fichiers = os.listdir(UPLOAD_DIR)
            for nom in fichiers:
                if not nom.endswith(".xlsx") or nom.startswith("~$"):
                    continue

                chemin = os.path.join(UPLOAD_DIR, nom)
                if not os.path.isfile(chemin):
                    continue

                current_hash = file_hash(chemin)
                if current_hash is None:
                    continue

                if chemin not in processed_files_hash or processed_files_hash[chemin] != current_hash:
                    print(f"[watcher] Nouveau fichier détecté ou contenu modifié : {nom}")
                    run_test_py(chemin)
                    processed_files_hash[chemin] = current_hash

        except Exception as e:
            print(f"[watcher] Erreur inattendue dans la boucle principale : {e}")

        time.sleep(2)

if __name__ == "__main__":
    main()
