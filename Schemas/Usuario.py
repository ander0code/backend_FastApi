from pydantic import BaseModel
from datetime import datetime





class UserBase(BaseModel):
    id: int
    fecha_creación: datetime 
    nombre: str
    last_name: str
    acerca_de_mi: str
    puntos_de_vista: str
    votos_positivos: int
    votos_negativos: int
    usuariofoto: int
    codigo_ID: int
    
    class from_attributes:
        orm_mode = True
