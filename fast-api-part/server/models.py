from pydantic import BaseModel
from typing import List

class PartyRoomScheme(BaseModel):
    """ Party Room general scheme """

    code: int
    owner_id: str
    guests: List[str]
    spotify_data: dict