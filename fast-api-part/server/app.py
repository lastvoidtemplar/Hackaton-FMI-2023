from fastapi import FastAPI, Depends, Response, status, Body
from fastapi.security import HTTPBearer

from .authentication import VerifyToken, verify_token

from .database import check_connection, client
from .models import PartyRoomScheme

app = FastAPI()

token_auth_scheme = HTTPBearer()

@app.get('/')
def root():
    """ Test simple endpoint """

    return {"message": "success"}

@app.get('/private')
async def private_message(response: Response, token: str = Depends(token_auth_scheme)):
    """ Test verification process """
    
    jwt_claims = VerifyToken(token.credentials).verify()
    if jwt_claims.get('status') == 'error':
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"msg": "Your token is not valid"}
    
    return {"msg": "Your token is valid"}

@app.get('/party-room')
async def get_party_room():
    """ Test read operation in MongoDB """
    if await check_connection():
        database = client.Hakaton
        document = await database.parties.find_one({"owner_id": "12345678"})
        return PartyRoomScheme(**document)
    else:
        return {"msg": "fail"}


# Test request body
# write token verification function
# write checking connection to DB function

@app.patch('/join')
async def join_to_room(response: Response, 
                       userId: str = Body(), 
                       code: int = Body(), 
                       token: str = Depends(token_auth_scheme)):

    if verify_token(token.credentials):
        if await check_connection():
            database = client.Hakaton
            document = await database.parties.find_one({"code": code})
            obj = PartyRoomScheme(**document)
            if obj:
                obj.guest.append(userId)
                await database.parties.update_one({'code': code}, {'$set': dict(obj)})
            return {"msg": "success"}
    
    response.status_code = status.HTTP_400_BAD_REQUEST
    return {"msg": "fail"} 

@app.patch('/leave')
async def leave_room(response: Response, 
                       userId: str = Body(), 
                       code: int = Body(), 
                       token: str = Depends(token_auth_scheme)):

    if verify_token(token.credentials):
        if await check_connection():
            database = client.Hakaton
            document = await database.parties.find_one({"code": code})
            obj = PartyRoomScheme(**document)
            if obj:
                obj.guest.remove(userId)
                await database.parties.update_one({'code': code}, {'$set': dict(obj)})
            return {"msg": "success"}
    
    response.status_code = status.HTTP_400_BAD_REQUEST
    return {"msg": "fail"} 

