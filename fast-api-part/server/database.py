# MongoDB Driver
import motor.motor_asyncio

import os
import dotenv
dotenv.load_dotenv()

# MongoDB credentials
user = os.getenv('USER')
password = os.getenv('PASSWORD')

# Connecting to DB
client = motor.motor_asyncio.AsyncIOMotorClient(
    #f"mongodb+srv://{user}:{password}@cluster0.pbfpoj7.mongodb.net/?retryWrites=true&w=majority"
    f"mongodb+srv://mongo:2VxOzTHwBQf6o45D@cluster0.pbfpoj7.mongodb.net/?retryWrites=true&w=majority"
)

async def check_connection():
    try:
        print(await client.server_info())
    except Exception:
        print("Unable to connect to the server")
        return False

    return True