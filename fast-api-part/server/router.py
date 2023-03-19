from fastapi import Depends, Body, HTTPException, APIRouter
from fastapi.security import HTTPBearer

from .authentication import verify_token

from .database import find_one_item, update_one_item
from .models import PartyRoomScheme


router = APIRouter(prefix="/api")

token_auth_scheme = HTTPBearer()
@router.get('/fapi')
async def hello():
     return "This is fapi"

@router.patch('/join', response_description="Join provided user to the party", tags=['Join'])
async def join_to_room(
                       userId: str = Body(), 
                       code: int = Body(), 
                       token: str = Depends(token_auth_scheme)):

    # Verify AUTH0 JWT token
    verification_info = verify_token(token.credentials)
    # Add provided user to the party
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

@router.patch('/leave', response_description="Remove provided user from the party", tags=['Leave'])
async def leave_room(
                       userId: str = Body(), 
                       code: int = Body(), 
                       token: str = Depends(token_auth_scheme)):

    # Verify AUTH0 JWT token
    verification_info = verify_token(token.credentials)
    # Remove provided user to the party
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

# async def get_qr_code(response: Response,
#                 user_id: str = Body(),
#                 owner_id: str = Body(),
#                 code: int = Body(),
#                 party_id: str = Body(),
#                 token: str = Depends(token_auth_scheme)):
#     if verify_token(token.credentials):
#         if await check_connection():
#             database = client.Hakaton
#             print(code)
#             document = await database.parties.find_one({'code': code})
#             print(document)
#             obj = PartyRoomScheme(**document)
#             print(obj)
#             if obj and user_id in obj.guest and owner_id == obj.owner_id:
#                 qrcode_base64 = make_base64_qr_code({'owner_id': owner_id, 'code': code, 'party_id': party_id})
#                 return qrcode_base64
#     response.status_code = status.HTTP_400_BAD_REQUEST
#     return {"msg": "fail"}
