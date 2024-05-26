from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Model_DB
from Schemas import Publicaciones,Usuario_Schema
from config.base_connection import SessionLocal
from pydantic import EmailStr
from typing import Any,List

user = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
#este es el que actualmente estas usando 

@user.get("/users/{email}",response_model=None)
def get_users( email = EmailStr ,db: Session = Depends(get_db) )-> Any:
    resultados = db.query(Model_DB.User).\
        join(Model_DB.UserData, Model_DB.UserData.id == Model_DB.User.codigo_ID).\
        filter(Model_DB.UserData.email == email).\
        all()

    if not resultados:
        #aca cambie el mensaje no te olvides 
        raise HTTPException(status_code=404, detail="buscando usuario por email: no existe")

    return resultados

#este es al que debes migrar ahora 
#ahora puede usar la etiqueta del usuario

@user.get("/users_nuevo/{email}",response_model=List[Usuario_Schema.UserBaseModel])
def get_users_muevo( email = EmailStr ,db: Session = Depends(get_db) )-> Any:
    resultados = db.query(Model_DB.User,Model_DB.EtiquetaCarrera).\
        join(Model_DB.UserData, Model_DB.UserData.id == Model_DB.User.codigo_ID).\
        join(Model_DB.EtiquetaUsuario, Model_DB.EtiquetaUsuario.etiquetaUserID == Model_DB.User.id).\
        join(Model_DB.EtiquetaCarrera, Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetaUsuario.etiquetaID).\
        filter(Model_DB.UserData.email == email).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="buscando usuario por email: no existe")

    response = [
        Usuario_Schema.UserBaseModel(
            id=user.id,
            fecha_creación=user.fecha_creación,
            nombre=user.nombre,
            last_Name=user.last_Name,
            acerca_de_mi=user.acerca_de_mi,
            puntos_de_vista=user.puntos_de_vista,
            votos_positivos=user.votos_positivos,
            votos_negativos=user.votos_negativos,
            usuariofoto=user.usuariofoto,
            codigo_ID=user.codigo_ID,
            carrera=Usuario_Schema.EtiqetaCarreraBase(
                etiquetaNombre=carrera.etiquetaNombre,
            ) if carrera else None
        )
        for user, carrera in resultados
    ]
    return response


#este es el que usas altualmente 

@user.get("/Post/",response_model=None)
async def get_post(db: Session= Depends(get_db)) -> Any:
    return db.query(Model_DB.Post).all()


#mira depende de ti, lo puedo mejorar, seria que me esperes , o usarlo asi nomas, pero lo puedo mejorar pero me gana la hora
@user.get("/posts_nuevo/",response_model=List[Publicaciones.PostWithCurso])
async def get_post_nuevo(
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


