from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy import func, case, desc
from models import Model_DB
from Schemas import Servicio_Schema
import pytz
from datetime import datetime

from config.base_connection import SessionLocal
from pydantic import EmailStr
from typing import Any,List


serv = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@serv.get("/get_servicios_id/{id_servicio}",response_model=List[Servicio_Schema.Calificacion_Model])
def get_servicios_id( id_servicio = int ,db: Session = Depends(get_db) )-> Any:
    resultados = db.query(
        Model_DB.CalificacionServicio
        ).filter(
            Model_DB.CalificacionServicio.id_servicio == id_servicio
        ).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Calificaciones no encontradas")

    response = [
        Servicio_Schema.Calificacion_Model(

            id_user = cali_servicio.id_user,
            id_servicio = cali_servicio.id_servicio,
            calificacion_general = cali_servicio.calificacion_general,
            puntuacion = cali_servicio.puntuacion,
            calificacion_1 = cali_servicio.calificacion_1,
            calificacion_2 = cali_servicio.calificacion_2,
            calificacion_3 = cali_servicio.calificacion_3,
            resena = cali_servicio.resena,
            fecha_creacion = cali_servicio.fecha_creacion
            
        )
        for cali_servicio in resultados
    ]
    return response

@serv.post("/put_servicios_id/{user_id}",response_model=List[Servicio_Schema.Response])
def put_servicios_id(user_id: int,cali_servicio :  Servicio_Schema.Calificacion_Model, db: Session = Depends(get_db))-> Any:

    tz = pytz.timezone('America/Lima')
    fecha_actual_peru = datetime.now(tz)
    fecha_formateada = fecha_actual_peru.strftime('%Y-%m-%d')

    nombre_ = db.query(
        Model_DB.User.nombre
        ).filter(Model_DB.User.id == user_id).first()
    apellido_ = db.query(
        Model_DB.User.last_Name
        ).filter(Model_DB.User.id == user_id).first()
        

    new_cali = Model_DB.CalificacionServicio(
        
        # falta arreglar
        
            id_user = cali_servicio.id_user,
            id_servicio = cali_servicio.id_servicio,
            calificacion_general = cali_servicio.calificacion_general,
            puntuacion = cali_servicio.calificacion_general,
            calificacion_1 = cali_servicio.calificacion_1,
            calificacion_2 = cali_servicio.calificacion_2,
            calificacion_3 = cali_servicio.calificacion_3,
            resena = cali_servicio.resena,
            fecha_creacion =  fecha_formateada
            
        )
    db.add(new_cali)
    db.commit()
    event_voto =  "se agrego un nuevo voto"
    
    response = [
        Servicio_Schema.Response(
                    message=event_voto,
                    status="success",
                )
            ]
    return response
