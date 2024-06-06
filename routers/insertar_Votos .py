from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
import pytz
from sqlalchemy.exc import SQLAlchemyError
from models import Model_DB
from Schemas import votos
from config.base_connection import SessionLocal
from typing import Any
from datetime import datetime

voto = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@voto.post("/voto/{mensajeID}/{user_id}", response_model=None)
async def create_post(mensajeID : int,user_id : int,comment: votos.VotosModel, db: Session = Depends(get_db)) -> Any:
    try:
        if comment.tipo_voto not in ['POST', 'NEG']:
            raise HTTPException(status_code=400, detail="Tipo de voto inválido")

        voto_existente = db.query(Model_DB.Vote).filter(Model_DB.Vote.mensajeID == mensajeID,Model_DB.Vote.userID == user_id).first()
        print(voto_existente)
        if voto_existente is None:
            # Insertar nuevo voto
            nuevo_voto = Model_DB.Vote(mensajeID=mensajeID, userID=user_id, tipo_Voto=comment.tipo_voto)
            db.add(nuevo_voto)
            db.commit()
            print("se inserto el voto")
        else:
            if voto_existente.tipo_Voto == comment.tipo_voto:
                # Eliminar el voto existente
                db.delete(voto_existente)
                db.commit()
                print("se elimino el voto existente")
            else:
                # Cambiar el voto existente
                voto_existente.tipo_Voto = comment.tipo_voto
                db.commit()
                print("se cambio el tipo de voto")

        return {"message": "Voto procesado correctamente"}
        
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error en la base de datos: " + str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor: " + str(e))

