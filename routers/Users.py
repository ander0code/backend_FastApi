from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy import func, case, desc
from models import Model_DB
from Schemas import Publicaciones,Usuario_Schema

from config.base_connection import SessionLocal
from pydantic import EmailStr
from typing import Any,List


user = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@user.get("/users_nuevo/{email}",response_model=List[Usuario_Schema.UserBaseModel])
def get_users_muevo( email = EmailStr ,db: Session = Depends(get_db) )-> Any:
    print(email)
    resultados = db.query(
        Model_DB.User,
        Model_DB.EtiquetaCarrera,
        Model_DB.UserData.codigo_std
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
            codigo_user = codigo_usuario,
            carrera=Usuario_Schema.EtiqetaCarreraBase(
                etiquetaNombre=carrera.etiquetaNombre,
            ) if carrera else None
        )
        for user, carrera ,codigo_usuario in resultados
    ]
    return response


@user.get("/posts_nuevo/", response_model=List[Publicaciones.PostWithCurso])
async def get_post_nuevo(db: Session = Depends(get_db)) -> Any:
    resultados = db.query(
        Model_DB.Post,
        Model_DB.EtiquetaCarrera,
        Model_DB.EtiquetaCurso,
        func.sum(case((Model_DB.Vote.tipo_Voto == 'POST', 1), else_=0)) -
        func.sum(case((Model_DB.Vote.tipo_Voto == 'NEG', 1), else_=0)).label('votos')
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
        ).order_by(desc(Model_DB.Post.id)).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")

    response = [
        Publicaciones.PostWithCurso(
            post=Publicaciones.PostBase.model_validate(post),
            carrera=Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
            curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None,
            votos=Publicaciones.VotosBase(
                cantidad=voto_cantidad
            )
        )
        for post, carrera, curso, voto_cantidad in resultados
    ]
    return response



@user.get("/posts/{id_user}", response_model=None)
async def post_carrera(id_user: int, db: Session = Depends(get_db)) -> Any:

    resultados = db.query(
        Model_DB.Post
        ).join(
            Model_DB.User,
            Model_DB.User.id == Model_DB.Post.propietarioUserID
        ).filter(
            Model_DB.User.id == id_user
        ).order_by(desc(Model_DB.Post.id)).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="usuario inexistente")
    
    return resultados

@user.post("/user_update_descripcion/{id_user}", response_model=None)
async def update_user_description(id_user: int, user_update:Usuario_Schema.UserUpdateDescripcion , db: Session = Depends(get_db)) -> Any:
    try:
        user = db.query(Model_DB.User).filter(Model_DB.User.id == id_user).first()

        if not user:
            raise HTTPException(status_code=404, detail="Usuario inexistente")
        
        if user_update.AcercaDeMi is not None:
            user.acerca_de_mi = user_update.AcercaDeMi

        if user_update.PuntoDeVista is not None:
            user.puntos_de_vista = user_update.PuntoDeVista


        db.commit()
        return {"message": "Usuario actualizado correctamente"}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error en la base de datos: " + str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor: " + str(e))
    
      
@user.get("/get_pag_user/{id}",response_model=List[Usuario_Schema.UserBaseModel])
def get_pag_user( id_user = int ,db: Session = Depends(get_db) )-> Any:
    resultados = db.query(
        Model_DB.User,
        Model_DB.EtiquetaCarrera,
        Model_DB.UserData.codigo_std
        ).join(
            Model_DB.UserData, Model_DB.UserData.id == Model_DB.User.codigo_ID
        ).join(
            Model_DB.EtiquetaUsuario, Model_DB.EtiquetaUsuario.etiquetaUserID == Model_DB.User.id
        ).join(
            Model_DB.EtiquetaCarrera, Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetaUsuario.etiquetaID
        ).filter(
            Model_DB.UserData.id == id_user
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
            codigo_user = codigo_usuario,
            carrera=Usuario_Schema.EtiqetaCarreraBase(
                etiquetaNombre=carrera.etiquetaNombre,
            ) if carrera else None
        )
        for user, carrera ,codigo_usuario in resultados
    ]
    return response