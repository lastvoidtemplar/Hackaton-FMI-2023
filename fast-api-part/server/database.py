# MongoDB Driver
import motor.motor_asyncio

import os
import dotenv
dotenv.load_dotenv(dotenv_path='.fapi-env')

# MongoDB credentials
user = os.getenv('MONGODB_USER')
password = os.getenv('MONGODB_PASSWORD')

# MongoDB database name
database_name = os.getenv('DATABASE_NAME')
# MongoDB collection name
collection_name = os.getenv('COLLECTION_NAME')

mongo_db_uri = f"mongodb+srv://{user}:{password}@cluster0.pbfpoj7.mongodb.net/?retryWrites=true&w=majority"
# Connecting to DB
client = motor.motor_asyncio.AsyncIOMotorClient(
    mongo_db_uri
)

# Check connection to DB
async def check_connection():
    try:
        print(await client.server_info())
    except Exception:
        print("Unable to connect to the server")
        return False

    return True

# Find item in DB using search query 
async def find_one_item(search_query: dict):
    if await check_connection():
        database = client[database_name]
        document = await database[collection_name].find_one(search_query)
        if document:
            return document
    
    return None

# Update the item in DB
# Return True or False depending on operation success  
async def update_one_item(search_query: dict, data: dict):
    if await check_connection():
        database = client[database_name]
        document = await database[collection_name].find_one(search_query)
        if document:
            updated_document = await database[collection_name].update_one(search_query, {"$set": data})
            if updated_document:
                return True
    return False