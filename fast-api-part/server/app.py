from fastapi import FastAPI
from .router import router

# Initiate main app
app = FastAPI()
# Include main router
app.include_router(router)