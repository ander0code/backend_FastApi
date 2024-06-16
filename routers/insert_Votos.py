from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError,OperationalError
from models import Model_DB
from Schemas import votos
from config.base_connection import SessionLocal
from typing import Any
import pytz
from datetime import datetime
import time

voto = APIRouter()

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

@voto.post("/voto/{mensajeID}/{user_id}", response_model=None)
async def create_post(mensajeID: int, user_id: int, comment: votos.VotosModel, db: Session = Depends(get_db)) -> Any:
    try:
        tz = pytz.timezone('America/Lima')
        fecha_actual_peru = datetime.now(tz)
        fecha_formateada = fecha_actual_peru.strftime('%Y-%m-%d')
        
        # Verificar que el tipo de voto sea válido
        if comment.tipo_voto not in ['POST', 'NEG']:
            raise HTTPException(status_code=400, detail="Tipo de voto inválido")

        # Buscar si el voto ya existe
        voto_existente = db.query(Model_DB.Vote).filter(Model_DB.Vote.mensajeID == mensajeID, Model_DB.Vote.userID == user_id).first()

        if voto_existente is None:
            # Insertar nuevo voto si no existe
            nuevo_voto = Model_DB.Vote(mensajeID=mensajeID, userID=user_id, tipo_Voto=comment.tipo_voto , fecha_creacion = fecha_formateada)
            db.add(nuevo_voto)
            db.commit()
            event_voto =  "se agrego un nuevo voto"
        else:
            if voto_existente.tipo_Voto == comment.tipo_voto:
                # Eliminar el voto existente si el tipo de voto es el mismo
                db.delete(voto_existente)
                db.commit()
                event_voto = "se elimino el voto existente"
            else:
                # Cambiar el tipo de voto existente si es diferente
                voto_existente.tipo_Voto = comment.tipo_voto
                db.commit()
                event_voto = "se cambio el tipo de voto"

        return {"message": "Voto procesado correctamente", 
                "evento" : f"{event_voto}"}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error en la base de datos: " + str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor: " + str(e))