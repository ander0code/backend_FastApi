from pydantic import BaseModel
from typing import Optional
from datetime import date


class VotosModel(BaseModel):
    tipo_voto : str

class VotosResponde(BaseModel):
    message: str
    status: str