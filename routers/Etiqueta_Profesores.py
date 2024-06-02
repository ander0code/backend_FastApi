from fastapi import APIRouter,Depends,HTTPException,Query,Path
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from models import Model_DB
from Schemas import Publicaciones,Comentarios
from config.base_connection import SessionLocal
from typing import Any,List

Profe = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@Profe.get("/get_profesores",response_model=None)
def get_profes(db: Session = Depends(get_db) )-> Any:
    resultados = db.query(Model_DB.EtiquetaProfesores).all()
    if not resultados:
        raise HTTPException(status_code=404, detail="buscando usuario por email: no existe")
    return resultados