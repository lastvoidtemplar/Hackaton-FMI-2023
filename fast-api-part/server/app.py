from fastapi import FastAPI, Depends, Response, status
from fastapi.security import HTTPBearer

from .authentication import VerifyToken

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