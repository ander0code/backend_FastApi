from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from models import Model_DB
from config.base_connection import SessionLocal
from typing import Any

user = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@user.get("/users/",response_model=None)
async def get_users( db: Session = Depends(get_db) )-> Any:
    return db.query(Model_DB.User).all()
   

@user.get("/Post/",response_model=None)
async def get_post(db: Session= Depends(get_db)) -> Any:
    return db.query(Model_DB.Post).all()