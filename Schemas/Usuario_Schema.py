from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class EtiqetaCarreraBase(BaseModel):
    
    etiquetaNombre: str

    class Config:
        from_attributes = True

class UserBaseModel(BaseModel):
    id: int
    fecha_creación: date
    nombre: Optional[str]
    last_Name: Optional[str]
    acerca_de_mi: Optional[str]
    puntos_de_vista: Optional[str]
    votos_positivos: Optional[int]
    votos_negativos: Optional[int]
    usuariofoto: Optional[int]
    codigo_ID: int
    carrera : Optional[EtiqetaCarreraBase]

    class Config:
        from_attributes = True