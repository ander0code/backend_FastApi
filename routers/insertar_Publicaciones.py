from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
import pytz
from models import Model_DB
from Schemas import Publicaciones
from config.base_connection import SessionLocal
from typing import Any,List
from datetime import datetime
post = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()





@post.post("/posts/{id_user}", response_model=Publicaciones.PostWithCurso)
async def create_post(id_user : int,post: Publicaciones.PostCreate, db: Session = Depends(get_db)) -> Any:

    carrera = db.query(Model_DB.EtiquetaCarrera).filter(Model_DB.EtiquetaCarrera.id_carrera == post.carrera_id).first()
    if not carrera:
        carrera = None
    
    post_user_tupla = db.query(Model_DB.User.nombre).filter(Model_DB.User.id == id_user).first()
    post_user = post_user_tupla[0] if post_user_tupla else None
    
    curso = None
    if post.curso_id:
        curso = db.query(Model_DB.EtiquetaCurso).filter(Model_DB.EtiquetaCurso.id_curso == post.curso_id).first()
        if not curso:
            curso = None
    tz = pytz.timezone('America/Lima')
    fecha_actual_peru = datetime.now(tz)
    fecha_formateada = fecha_actual_peru.strftime('%Y-%m-%d')

    nuevo_post = Model_DB.Post(
                            propietarioUserID = id_user,
                            ultimoEditorUserlD = id_user,
                            titulo = post.title, 
                            descripcion = post.content ,
                            propietarioNombre = post_user,
                            fecha_Creacion = fecha_formateada,
                            status = 1,
                            conteo_visitas = 0,
                            conteo_respuestas = 0,
                            conteo_favoritos = 0,
                            recuento_comentarios = 0
                            )
    db.add(nuevo_post)
    db.commit()
    db.refresh(nuevo_post)
    
    carrera_id = post.carrera_id if post.carrera_id != 0 else None
    print(carrera_id)
    curso_id = post.curso_id if post.curso_id != 0 else None
    print(curso_id)

    etiqueta_publicacion = Model_DB.EtiquetasPublicacion(
        Comentario_ID=nuevo_post.id,
        etiqueta_carrera_ID=carrera_id,
        etiqueta_curso_ID=curso_id
    
    )
    db.add(etiqueta_publicacion)
    db.commit()
    
    #insertar historial
    Historial_post = Model_DB.HistorialPost(
            id_mensaje = nuevo_post.id,
            id_usuario = id_user,
            fecha_creación = fecha_formateada,
            usuario_nombre = post_user,
            titulo = nuevo_post.titulo,
            descripcion = nuevo_post.descripcion
    )
    db.add(Historial_post)
    db.commit()
    
    response = Publicaciones.PostWithCurso(
        post=Publicaciones.PostBase.model_validate(nuevo_post),
        carrera=Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
        curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None,
        votos=Publicaciones.VotosBase(
            cantidad=0  
        )
    )
    return response