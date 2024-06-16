from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker

from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('mysql+pymysql://admin:..A+7+821+092+005+KK2+005+Jbc+20-04a-s2@database-ua.cho2k8q8ai9o.us-east-2.rds.amazonaws.com:3306/Uni_Autonoma')

conn = engine.connect()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()