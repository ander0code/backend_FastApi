from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from models import Model_DB
from config.base_connection import SessionLocal
from pydantic import EmailStr
from typing import Any

user = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@user.get("/users/{email}",response_model=None)
def get_users( email = EmailStr ,db: Session = Depends(get_db) )-> Any:
    resultados = db.query(Model_DB.User).\
        join(Model_DB.UserData, Model_DB.UserData.id == Model_DB.User.codigo_ID).\
        filter(Model_DB.UserData.email == email).\
        all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Carrera no registrada - o no existe, no es la id de la carrera, fijate en la database imvecil")

    return resultados
    #return db.query(Model_DB.User).all()
   

@user.get("/Post/",response_model=None)
async def get_post(db: Session= Depends(get_db)) -> Any:
    return db.query(Model_DB.Post).all()