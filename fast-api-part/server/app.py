from fastapi import FastAPI, Depends, Body, HTTPException
from fastapi.security import HTTPBearer

from .authentication import verify_token

from .database import find_one_item, update_one_item
from .models import PartyRoomScheme

app = FastAPI()

token_auth_scheme = HTTPBearer()

@app.patch('/join', response_description="Join provided user to the party", tags=['Join'])
async def join_to_room(
                       userId: str = Body(), 
                       code: int = Body(), 
                       token: str = Depends(token_auth_scheme)):

    verification_info = verify_token(token.credentials)
    if verification_info.get('status'):
            
            document = await find_one_item({'code': code})
            if document:
                obj = PartyRoomScheme(**document)
                if userId in obj.guest:
                    raise HTTPException(status_code=400, detail=f"The user with id {userId} already in guest list")
                obj.guest.append(userId)

                if await update_one_item({'code': code}, dict(obj)): 
                    return {f"User({userId}) was successfully added to the party({code})"}
                else:
                    raise HTTPException(status_code=404, detail="There was an error updating the party data")
            else:
                raise HTTPException(status_code=404, detail=f"Party this code {code} is not found")
    
    why = verification_info.get('msg')
    raise HTTPException(status_code=400, detail=f"Your token isn't valid: {why}")

@app.patch('/leave', response_description="Remove provided user from the party", tags=['Leave'])
async def leave_room(
                       userId: str = Body(), 
                       code: int = Body(), 
                       token: str = Depends(token_auth_scheme)):

    verification_info = verify_token(token.credentials)
    if verification_info.get('status'):
            
            document = await find_one_item({'code': code})
            if document:
                obj = PartyRoomScheme(**document)
                if userId not in obj.guest:
                    raise HTTPException(status_code=400, detail=f"The user with id {userId} isn't in guest list")
                obj.guest.remove(userId)
                
                if await update_one_item({'code': code}, dict(obj)): 
                    return {'msg': f'User was successfully removed from the party {code}'}
                else:
                    raise HTTPException(status_code=404, detail="There was an error updating the party data")
            else:
                raise HTTPException(status_code=404, detail=f"Party with this code is not found: {code}")
    
    why = verification_info.get('msg')
    raise HTTPException(status_code=400, detail=f"Your token isn't valid: {why}")

