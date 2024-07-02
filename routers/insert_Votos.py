from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, case ,desc
from sqlalchemy.exc import SQLAlchemyError,OperationalError
from models import Model_DB
from Schemas import votos
from config.base_connection import SessionLocal
from typing import Any,List
import pytz
from datetime import datetime
import time

voto = APIRouter()



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@voto.post("/voto/{mensajeID}/{user_id}", response_model=List[votos.VotosResponde])
async def create_voto_post(mensajeID: int, user_id: int, comment: votos.VotosModel, db: Session = Depends(get_db)) -> Any:

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
            nuevo_voto = Model_DB.Vote(tipo_objeto = comment.tipo_objeto ,mensajeID=mensajeID, comentarioID = None ,userID=user_id, tipo_Voto=comment.tipo_voto  ,fecha_creacion = fecha_formateada)
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
                

        resultados = db.query(
        func.sum(case((Model_DB.Vote.tipo_Voto == 'POST', 1), else_=0)) - 
        func.sum(case((Model_DB.Vote.tipo_Voto == 'NEG', 1), else_=0)).label("votos")
        ).join(
            Model_DB.Post,
            Model_DB.Post.id == Model_DB.Vote.mensajeID
        ).filter(
            Model_DB.Post.id == mensajeID
        ).group_by(
            Model_DB.Post.id,
        ).first()
        if resultados is None:
            resultados = [0]  
    
        response = [
            votos.VotosResponde(
                    message=event_voto,
                    status="success",
                    cantidad= voto_cantidad
                )
                    for voto_cantidad in resultados
                ]
        return response
    

@voto.post("/votoComment/{mensajeID}/{user_id}", response_model=List[votos.VotosResponde])
async def create_voto_comment(comentarioID: int, user_id: int, comment: votos.VotosModel, db: Session = Depends(get_db)) -> Any:

        tz = pytz.timezone('America/Lima')
        fecha_actual_peru = datetime.now(tz)
        fecha_formateada = fecha_actual_peru.strftime('%Y-%m-%d')
        
        # Verificar que el tipo de voto sea válido
        if comment.tipo_voto not in ['POST', 'NEG']:
            raise HTTPException(status_code=400, detail="Tipo de voto inválido")
        
        # Buscar si el voto ya existe
        voto_existente = db.query(Model_DB.Vote).filter(Model_DB.Vote.comentarioID == comentarioID, Model_DB.Vote.userID == user_id).first()

        if voto_existente is None:
            # Insertar nuevo voto si no existe
            nuevo_voto = Model_DB.Vote(tipo_objeto = comment.tipo_objeto ,mensajeID=None, comentarioID = comentarioID ,userID=user_id, tipo_Voto=comment.tipo_voto  ,fecha_creacion = fecha_formateada)
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
                

        resultados = db.query(
        func.sum(case((Model_DB.Vote.tipo_Voto == 'POST', 1), else_=0)) - 
        func.sum(case((Model_DB.Vote.tipo_Voto == 'NEG', 1), else_=0)).label("votos")
        ).join(
            Model_DB.Comment,
            Model_DB.Comment.comentario_id == Model_DB.Vote.comentarioID
        ).filter(
            Model_DB.Comment.comentario_id == comentarioID
        ).group_by(
            Model_DB.Comment.comentario_id,
        ).first()
        if resultados is None:
            resultados = [0]  
    
        response = [
            votos.VotosResponde(
                    message=event_voto,
                    status="success",
                    cantidad= voto_cantidad
                )
                    for voto_cantidad in resultados
                ]
        return response



