from pymongo import MongoClient
import os

if os.path.exists("/app/data"):
    mongo_url = "mongodb://mongo:27017/"  # Exemple : MongoDB dans un conteneur nommé 'mongo'
else:
    mongo_url = "mongodb://localhost:27017/"

client = MongoClient(mongo_url)
db = client["etl_database"]

print("Documents dans data :")
for doc in db.data.find():
    print(doc)

print("\nDocuments dans outputs :")
for doc in db.outputs.find():
    print(doc)
