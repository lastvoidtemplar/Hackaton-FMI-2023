# MongoDB Driver
import motor.motor_asyncio

import os
import dotenv
dotenv.load_dotenv()

# MongoDB credentials
user = os.getenv('MONGODB_USER')
password = os.getenv('MONGODB_PASSWORD')

mongo_db_uri = f"mongodb+srv://{user}:{password}@cluster0.pbfpoj7.mongodb.net/?retryWrites=true&w=majority"
# Connecting to DB
client = motor.motor_asyncio.AsyncIOMotorClient(
    mongo_db_uri
)

async def check_connection():
    try:
        print(await client.server_info())
    except Exception:
        print("Unable to connect to the server")
        return False

    return True

async def find_one_item(search_query: dict):
    if await check_connection():
        database = client.Hakaton
        document = await database.parties.find_one(search_query)
        if document:
            return document
    
    return None

async def update_one_item(search_query: dict, data: dict):
    if await check_connection():
        database = client.Hakaton
        document = await database.parties.find_one(search_query)
        if document:
            updated_document = await database.parties.update_one(search_query, {"$set": data})
            if updated_document:
                return True
    return False