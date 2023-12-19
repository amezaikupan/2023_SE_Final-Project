import json
from pymongo import MongoClient 


# Making Connection
myclient = MongoClient("mongodb://localhost:27017/") 

# database 
db = myclient.Conference_info

Collection = db.Conference

# Loading or Opening the json file
with open('Conferences.json') as file:
	file_data = json.load(file)
	
Collection.delete_many({})

if isinstance(file_data, list):
	Collection.insert_many(file_data) 
else:
	Collection.insert_one(file_data)
	
for i in db.Conference.find({"Title": "International Conference on Bioinformatics, Computational Biology and Biomedical Engineering ICBCBBE on December 13-14, 2023 in Cairo, Egypt"}):
    print(i) 
