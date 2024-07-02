from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy import func, case, desc
from models import Model_DB
from Schemas import Vista_schema

from config.base_connection import SessionLocal
from typing import Any,List
import pytz
from datetime import datetime

vista = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
@vista.post("/vistas/{id_post}", response_model=Vista_schema.Response)
async def create_vista(id_post: int, db: Session = Depends(get_db)) -> Any:
    try:
        vista = db.query(Model_DB.Post).filter(Model_DB.Post.id == id_post).first()

        if not vista:
            raise HTTPException(status_code=404, detail="Post inexistente")

        vista.conteo_visitas += 1

        db.commit()
        evento = "vista agredada"

        response = Vista_schema.Response(
                vistas= vista.conteo_visitas,
                event= evento,
                response= "success"     
        )
        return response
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error en la base de datos: " + str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor: " + str(e))