from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
import pytz
from sqlalchemy.exc import SQLAlchemyError,OperationalError
from models import Model_DB
from Schemas import Comentarios
from config.base_connection import SessionLocal
from typing import Any
from datetime import datetime
import time

coment = APIRouter()

# Dependency
from sqlalchemy.exc import OperationalError
import time
from fastapi import HTTPException

def get_db():
    reintentos = 3
    retraso = 5
    for _ in range(reintentos):
        db = SessionLocal()
        try:
            yield db
            return  # Salimos del bucle después de un yield exitoso
        except OperationalError:
            db.close()
            time.sleep(retraso)
    raise HTTPException(status_code=500, detalle="No se pudo conectar a la base de datos después de varios intentos")

        

@coment.post("/coment/{Post_id}/{id_user}", response_model=None)
async def create_post(Post_id : int,id_user : int,comment: Comentarios.ComentariosInsert, db: Session = Depends(get_db)) -> Any:
    try:
        post_user_tupla = db.query(Model_DB.User.nombre).filter(Model_DB.User.id == id_user).first()
        post_user = post_user_tupla[0] if post_user_tupla else None
        
        tz = pytz.timezone('America/Lima')
        fecha_actual_peru = datetime.now(tz)
        fecha_formateada = fecha_actual_peru.strftime('%Y-%m-%d')

        nuevo_post = Model_DB.Comment(
                                publicacion_ID = Post_id,
                                padre_comentario_id = None,
                                puntuacion = 0, 
                                texto = comment.texto ,
                                userID = id_user,
                                usuarioName = post_user,
                                fecha_creacion = fecha_formateada
                                )
        db.add(nuevo_post)
        db.commit()
        db.refresh(nuevo_post)
        
        
        recuento_comentarios_ = db.query(Model_DB.Comment).filter(Model_DB.Comment.publicacion_ID == Post_id).count()
        print(recuento_comentarios_)
        db.query(Model_DB.Post).filter(Model_DB.Post.id == Post_id).update({Model_DB.Post.recuento_comentarios: recuento_comentarios_})
        db.commit()

        
        response = Comentarios.ComentariosResponse(
                message="Comentario creado exitosamente",
                status="success"
            )
        return response

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error en la base de datos: " + str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor: " + str(e))