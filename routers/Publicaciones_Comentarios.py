from fastapi import APIRouter,Depends,HTTPException,Query,Path
from sqlalchemy.orm import Session
from models import Model_DB
from Schemas import Publicaciones
from config.base_connection import SessionLocal
from typing import Any,Optional,List

post = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
@post.get("/posts/{carrera_id}", response_model=List[Publicaciones.PostWithCurso])
async def post_carrera(carrera_id: int, db: Session = Depends(get_db)) -> Any:

    resultados = db.query(
        Model_DB.Post,Model_DB.EtiquetaCarrera,Model_DB.EtiquetaCurso).\
            join(Model_DB.EtiquetasPublicacion,
                Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id).\
            join(Model_DB.EtiquetaCarrera,
                Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID).\
            outerjoin(Model_DB.EtiquetaCurso,
                Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID).\
        filter(Model_DB.EtiquetaCarrera.id_carrera == carrera_id).\
        all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Carrera no registrada - o no existe, no es la id de la carrera, fijate en la database imvecil")

    response = [
        Publicaciones.PostWithCurso(
            post=Publicaciones.PostBase.model_validate(post),
            carrera = Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
            curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None
        )
        for post, carrera,curso in resultados
    ]
    return response


@post.get("/curso/{carrera_id}/{ciclo}", response_model=None)
async def post_carrera(
    carrera_id: int ,
    ciclo: int ,
    db: Session = Depends(get_db)
) -> Any:
    resultados = db.query(
        Model_DB.EtiquetaCurso).\
            join(Model_DB.EtiquetaEtiquetaCurso,
                Model_DB.EtiquetaEtiquetaCurso.idcurso == Model_DB.EtiquetaCurso.id_curso).\
            join(Model_DB.EtiquetaCarrera,
                Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetaEtiquetaCurso.idcarrera).\
            filter(
                Model_DB.EtiquetaCarrera.id_carrera == carrera_id,
                Model_DB.EtiquetaCurso.ciclo == ciclo).\
            all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Carrera no encontrada")

    return resultados

@post.get("/posts/{carrera_id}/{ciclo}", response_model=List[Publicaciones.PostWithCurso])
async def post_carrera(
    carrera_id: int ,
    ciclo: int ,
    db: Session = Depends(get_db)
) -> Any:

    resultados = db.query(
        Model_DB.Post,Model_DB.EtiquetaCarrera,Model_DB.EtiquetaCurso).\
            join(Model_DB.EtiquetasPublicacion,
                Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id).\
            join(Model_DB.EtiquetaCarrera,
                Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID).\
            join(Model_DB.EtiquetaCurso,
                Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID).\
            filter(
                Model_DB.EtiquetaCarrera.id_carrera == carrera_id,
                Model_DB.EtiquetaCurso.ciclo == ciclo).\
            all()

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


@post.get("/posts/{carrera_id}/{ciclo}/{curso}",response_model=List[Publicaciones.PostWithCurso])

async def post_carrera(
    carrera_id: int ,
    ciclo: int ,
    curso: int,
    db: Session = Depends(get_db)
) -> Any:

    resultados = db.query(
         Model_DB.Post,Model_DB.EtiquetaCarrera,Model_DB.EtiquetaCurso).\
            join(Model_DB.EtiquetasPublicacion,
                Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id).\
            join(Model_DB.EtiquetaCarrera,
                Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID).\
            join(Model_DB.EtiquetaCurso,
                Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID).\
            filter(
                Model_DB.EtiquetaCarrera.id_carrera == carrera_id,
                Model_DB.EtiquetaCurso.ciclo == ciclo,
                Model_DB.EtiquetaCurso.id_curso == curso).\
            all()

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