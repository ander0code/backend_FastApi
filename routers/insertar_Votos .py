from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
import pytz
from models import Model_DB
from Schemas import Publicaciones
from config.base_connection import SessionLocal
from typing import Any,List
from datetime import datetime

voto = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#tmr tengo miedo xD 

