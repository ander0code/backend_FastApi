from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, case
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
        
@user.get("/users_nuevo/{email}",response_model=List[Usuario_Schema.UserBaseModel])
def get_users_muevo( email = EmailStr ,db: Session = Depends(get_db) )-> Any:
    resultados = db.query(
        Model_DB.User,
        Model_DB.EtiquetaCarrera
        ).join(
            Model_DB.UserData, Model_DB.UserData.id == Model_DB.User.codigo_ID
        ).join(
            Model_DB.EtiquetaUsuario, Model_DB.EtiquetaUsuario.etiquetaUserID == Model_DB.User.id
        ).join(
            Model_DB.EtiquetaCarrera, Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetaUsuario.etiquetaID
        ).filter(
            Model_DB.UserData.email == email
        ).all()

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


@user.get("/posts_nuevo/", response_model=List[Publicaciones.PostWithCurso])
async def get_post_nuevo(db: Session = Depends(get_db)) -> Any:
    resultados = db.query(
        Model_DB.Post,
        Model_DB.EtiquetaCarrera,
        Model_DB.EtiquetaCurso,
        func.sum(case((Model_DB.Vote.tipo_Voto == 'POST', 1), else_=0)).label('me_gusta'),
        func.sum(case((Model_DB.Vote.tipo_Voto == 'NEG', 1), else_=0)).label('no_me_gusta')
        ).join(
            Model_DB.EtiquetasPublicacion,
            Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id
        ).outerjoin(
            Model_DB.Vote,
            Model_DB.Vote.mensajeID == Model_DB.Post.id
        ).outerjoin(
            Model_DB.EtiquetaCarrera,
            Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID
        ).outerjoin(
            Model_DB.EtiquetaCurso,
            Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID
        ).group_by(
            Model_DB.Post.id,
            Model_DB.EtiquetaCarrera.id_carrera,
            Model_DB.EtiquetaCurso.id_curso
        ).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")

    response = [
        Publicaciones.PostWithCurso(
            post=Publicaciones.PostBase.model_validate(post),
            carrera=Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
            curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None,
            votos=Publicaciones.VotosBase(
                me_gusta=me_gusta,
                no_me_gusta=no_me_gusta
            )
        )
        for post, carrera, curso, me_gusta, no_me_gusta in resultados
    ]
    return response


