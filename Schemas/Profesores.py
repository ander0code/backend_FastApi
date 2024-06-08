from pydantic import BaseModel
from typing import Optional,List
   
class CuestionarioBase(BaseModel):   
    id_rol_STD : Optional[int] = None
    ciclo : Optional[int] = None
    nombreCurso :Optional[str] = None
    calidad: Optional[int] = None
    dificultad: Optional[int] = None
    etiquetas: Optional[List[str]] = None
    recomendacion: Optional[bool] = None
    texto: Optional[str] = None
   
class Pag1CuestionarioBase(BaseModel):   
    calidad_total: Optional[float] = None
    numero_total : Optional[int] = None
    recomendacion_porcen: Optional[float] = None
    dificultad_total: Optional[float] = None

class etiquetaprofeBase(BaseModel):
    id: int
    nombre_Profesor : str 
    id_carrera :int
    datos_ex : List[Optional[Pag1CuestionarioBase]] = None
    
class etiquetaprofeBaseV2(BaseModel):
    id: int
    nombre_Profesor : str 
    id_carrera :int
    datos_ex : List[Optional[CuestionarioBase]] = None
    