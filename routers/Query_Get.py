from config.base_connection import SessionLocal 
from sqlalchemy.orm import Session
from  models.Model_DB import User,Post,Comment

db = SessionLocal()

def get_users(db: Session):
    return db.query(User).all()

def get_post(db:Session):
    return db.query(Post).all()
