from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from models import Model_DB
from config.base_connection import SessionLocal
from typing import Any,List
from sqlalchemy import desc

Profe = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@Profe.get("/get_profesores/{id_carrera}}",response_model=None,
           description="Endpoint para obtener profesores por carrera. Acuerdate extraer primero el id de la carrera del usuario")
def get_profes(id_carrera = int  ,db: Session = Depends(get_db) )-> Any:
    resultados = db.query(
        Model_DB.EtiquetaProfesores
            ).join(
                Model_DB.EtiquetaCarrera,
                Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetaProfesores.id_carrera                
            ).filter(
                Model_DB.EtiquetaProfesores.id_carrera  == id_carrera
                ).all()
    if not resultados:
        raise HTTPException(status_code=404, detail="buscando porfesores por carrear: no existe ")
    return resultados