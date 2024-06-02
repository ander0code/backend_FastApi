from pydantic import BaseModel
from typing import Optional
from datetime import date

# obtener datos
class VotosBase(BaseModel):
    cantidad : int

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
    propietarioNombre: Optional[str] = None
    ultimoEditorUserlD: int
    ultimoEditorName: Optional[str] = None
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
    carrera : Optional[EtiqetaCarreraBase] = None
    curso: Optional[EtiquetaCursoBase] = None
    votos: Optional[VotosBase] = None
    
    
# insertar datos 

class PostCreate(BaseModel):
    title: str
    content: str
    carrera_id: Optional[int|None] = None
    curso_id: Optional[int|None] = None