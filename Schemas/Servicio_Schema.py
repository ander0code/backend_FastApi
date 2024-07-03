from pydantic import BaseModel
from datetime import date

class Insert_Cali_Model(BaseModel):
    
    calificacion_general : int
    puntuacion : int
    calificacion_1 : int 
    calificacion_2 : int 
    calificacion_3 : int 
    resena : str

class Calificacion_Model(Insert_Cali_Model):
    
    id_user : int
    nombre : str
    id_servicio : int 
    fecha_creacion : date
    
    class Config:
        from_attributes = True
    
class Response(BaseModel):

    message: str
    status: str
    
