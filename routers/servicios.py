from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy import func, case, desc
from models import Model_DB
from Schemas import Servicio_Schema

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
            
            id=cali_servicio.id,
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

@serv.post("/put_servicios_id",response_model=List[Servicio_Schema.Response])
def put_servicios_id(cali_servicio :  Servicio_Schema.Calificacion_Model, db: Session = Depends(get_db))-> Any:

    new_cali = Model_DB.CalificacionServicio(
        
            id_user = cali_servicio.id_user,
            id_servicio = cali_servicio.id_servicio,
            calificacion_general = cali_servicio.calificacion_general,
            puntuacion = cali_servicio.calificacion_general,
            calificacion_1 = cali_servicio.calificacion_1,
            calificacion_2 = cali_servicio.calificacion_2,
            calificacion_3 = cali_servicio.calificacion_3,
            resena = cali_servicio.resena
            
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
