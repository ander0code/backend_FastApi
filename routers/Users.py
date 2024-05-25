from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Model_DB
from Schemas import Publicaciones
from config.base_connection import SessionLocal
from typing import Any,List,Optional

user = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@user.get("/users/",response_model=None)
async def get_users( db: Session = Depends(get_db) )-> Any:
    return db.query(Model_DB.User).all()

@user.get("/Post/",response_model=None)
async def get_post(db: Session= Depends(get_db)) -> Any:
    return db.query(Model_DB.Post).all()

@user.get("/posts/",response_model=List[Publicaciones.PostWithCurso])
async def post_carrera(
    db: Session = Depends(get_db)
) -> Any:
    resultados = db.query(
        Model_DB.Post,Model_DB.EtiquetaCarrera,Model_DB.EtiquetaCurso).\
            outerjoin(Model_DB.EtiquetasPublicacion,
                Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id).\
            outerjoin(Model_DB.EtiquetaCarrera,
                Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID).\
            outerjoin(Model_DB.EtiquetaCurso,
                Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")

    response = [
        Publicaciones.PostWithCurso(
            post=Publicaciones.PostBase.model_validate(post),
            carrera = Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
            curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None
        )
        for post, carrera, curso in resultados
    ]
    return response


