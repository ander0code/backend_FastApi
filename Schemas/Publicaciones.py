from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class EtiquetaCursoBase(BaseModel):
    id_curso: int
    nombre_curso: str
    ciclo: int

    class Config:
        from_attributes = True 
class EtiqetaCarreraBase(BaseModel):
    
    id_carrera: int
    etiquetaNombre: str
    contarEtiquetas: Optional[int] = None
    descripcion: Optional[str] = None

    
    class Config:
        from_attributes = True
    
class PostBase(BaseModel):
    id: int
    fecha_Creacion: date
    conteo_visitas: int
    propietarioUserID: int
    propietarioNombre: str
    ultimoEditorUserlD: int
    ultimoEditorName: str
    recuento_comentarios: int
    conteo_respuestas: int
    conteo_favoritos: int
    status: int
    titulo: Optional[str]
    descripcion: Optional[str]

    class Config:
        from_attributes = True 

class PostWithCurso(BaseModel):
    post: PostBase
    carrera : Optional[EtiqetaCarreraBase] 
    curso: Optional[EtiquetaCursoBase] 
    
    
