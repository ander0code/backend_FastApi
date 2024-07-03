from pydantic import BaseModel
from typing import Optional
from datetime import date


class VotosModel(BaseModel):
    tipo_voto : str
    tipo_objeto: str 

class VotosResponde(BaseModel):
    message: str
    status: str
    cantidad : int
    
    class Config:
        from_attributes = True