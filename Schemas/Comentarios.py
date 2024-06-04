from pydantic import BaseModel
from typing import Optional
from datetime import date

class UserBase(BaseModel):
    nombre: Optional[str]
    last_Name: Optional[str]

class ComentariosBase(BaseModel):
    publicacion_ID: int
    padre_comentario_id: Optional[int]
    texto: str
    comentario_id: Optional[int]
    puntuacion: Optional[int]
    fecha_creacion: date
    userID: int
    UserData: UserBase
    
#insertar comentarios 
class ComentariosInsert(BaseModel):
    texto : str
    
class ComentariosResponse(BaseModel):
    message: str
    status: str