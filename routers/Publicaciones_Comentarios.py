from fastapi import APIRouter,Depends,HTTPException,Query,Path
from fastapi.responses import HTMLResponse,RedirectResponse
from sqlalchemy.orm import Session,aliased
from sqlalchemy import and_
from models import Model_DB
from config.base_connection import SessionLocal
from typing import Any,Annotated,Optional,Dict

post = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

# @post.get("/Post/{carrera}", response_model=None)
# async def get_post(item_id: int, db: Session = Depends(get_db)) -> Any:
#     post = db.query(Model_DB.Post).filter(Model_DB.Post.id == item_id).first()
#     if not post:
#         raise HTTPException(status_code=404, detail="Post not found")
#     return post

# @post.get("/Post/{carrera}", response_class=HTMLResponse)
# async def get_post(
#     carrera: int,
#     ciclo: Optional[int] = None,
#     curso: Optional[str] = None,
#     db: Session = Depends(get_db)
# ) -> Any:
#     query = db.query(Model_DB.Post)

#     if carrera or ciclo or curso:
#         query = query.join(Model_DB.EtiquetasPublicacion) \
#                      .join(Model_DB.EtiquetaCarrera) \
#                      .join(Model_DB.EtiquetaCurso)
        
#         filters = []
#         if carrera:
#             filters.append(Model_DB.EtiquetaCarrera.id_carrera == carrera)
#         if ciclo:
#             filters.append(Model_DB.EtiquetaCurso.ciclo == ciclo)
#         if curso:
#             filters.append(Model_DB.EtiquetaCurso.nombre_curso == curso)
        
#         query = query.filter(and_(*filters))
    
#     posts = query.all()
    
#     if not posts:
#         raise HTTPException(status_code=404, detail="No posts found")
    
#     return posts

@post.get("/posts/{carrera_id}", response_model=None)
async def post_carrera(carrera_id: int, db: Session = Depends(get_db)) -> Any:

    resultados = db.query(Model_DB.Post).\
        join(Model_DB.EtiquetasPublicacion, Model_DB.Post.id == Model_DB.EtiquetasPublicacion.Comentario_ID).\
        join(Model_DB.EtiquetaCarrera, Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID == Model_DB.EtiquetaCarrera.id_carrera).\
        filter(Model_DB.EtiquetaCarrera.id_carrera == carrera_id).\
        all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Carrera no registrada - o no existe, no es la id de la carrera, fijate en la database imvecil")

    return resultados

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

@post.get("/posts/{carrera_id}/{ciclo}", response_model=None)
async def post_carrera(
    carrera_id: int ,
    ciclo: int ,
    db: Session = Depends(get_db)
) -> Any:

    resultados = db.query(
        Model_DB.Post).\
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

    return resultados



@post.get("/posts/{carrera_id}/{ciclo}/{curso}", response_model=None)
async def post_carrera(
    carrera_id: int ,
    ciclo: int ,
    curso: int,
    db: Session = Depends(get_db)
) -> Any:

    resultados = db.query(
        Model_DB.Post).\
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

    return resultados