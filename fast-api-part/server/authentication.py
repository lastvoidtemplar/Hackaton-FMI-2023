import os
import jwt
import dotenv
dotenv.load_dotenv()

# def get_token():
#     import http.client
#     conn = http.client.HTTPSConnection("dev-40az2ck6ofh1tcz4.us.auth0.com")
#     payload = "{\"client_id\":\"fKV70JUlhORze45KESxdeDFwN9KWJp3O\",\"client_secret\":\"HMv7t_XIVtMUi6-IwKOnF7ujZrwBMFeeAIoNqbGs_2qcHLhrmqUXLJKZl2rHcOoQ\",\"audience\":\"https://partymanager.com\",\"grant_type\":\"client_credentials\"}"
#     headers = { 'content-type': "application/json" }
#     conn.request("POST", "/oauth/token", payload, headers)
#     res = conn.getresponse()
#     data = res.read()
#     print(data.decode("utf-8"))

def set_up():
    """Sets up configuration for the app"""

    config = {
        "DOMAIN": os.getenv("DOMAIN"),
        "API_AUDIENCE": os.getenv("API_AUDIENCE"),
        "ISSUER": os.getenv("ISSUER"),
        "ALGORITHMS": os.getenv("ALGORITHMS"),
    }
    
    return config

class VerifyToken():
    """Does all the token verification using PyJWT"""

    def __init__(self, token):
        self.token = token
        self.config = set_up()

        # This gets the JWKS
        jwks_url = f'https://{self.config["DOMAIN"]}/.well-known/jwks.json'
        self.jwks_client = jwt.PyJWKClient(jwks_url)

    def verify(self):
        try:
            self.signing_key = self.jwks_client.get_signing_key_from_jwt(
                self.token
            ).key
        except jwt.exceptions.PyJWKClientError as error:
            return {"status": "error", "msg": error.__str__()}
        except jwt.exceptions.DecodeError as error:
            return {"status": "error", "msg": error.__str__()}

        try:
            payload = jwt.decode(
                self.token,
                self.signing_key,
                algorithms=self.config["ALGORITHMS"],
                audience=self.config["API_AUDIENCE"],
                issuer=self.config["ISSUER"],
            )
        except Exception as e:
            return {"status": "error", "message": str(e)}

        return payload
    
def verify_token(token: str):
    """ Test version of this function """

    jwt_claims = VerifyToken(token).verify()
    if jwt_claims.get('status') == 'error':
        return {'status': False, 'msg': jwt_claims.get('msg', 'undefined error')}
    return {'status': True, 'msg': 'valid token'}