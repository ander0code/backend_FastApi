from typing import Annotated
from pydantic import EmailStr
from datetime import datetime,timedelta,timezone
from fastapi import APIRouter, Request ,Form , HTTPException,Cookie,Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse,RedirectResponse
from  jose import jwt,JWTError

import uvicorn

from typing import Any, Dict
from sqlalchemy.orm import Session,joinedload
from Schemas.Login_Schema import UserDataSchema
from models import Model_DB
from config.base_connection import SessionLocal

SECRETE_KEY = "AeDfZ7I7A1btH97zzDrlp4JKcaOqz2JH1HVRZscWYReB0QvdSk8UUE1m92x1IYv7"
TOKEN_SECONDS_EXP = 500

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
app = APIRouter()

jinjatemplates = Jinja2Templates(directory="frontend")


def db_users(db: Session = Depends(get_db)) -> Dict[int, UserDataSchema]:
    users = db.query(Model_DB.UserData).all()
    users_dict = {user.id: UserDataSchema.model_validate(user).model_dump() for user in users}
    return users_dict


def get_user(email:str,db:Session):
    return db.query(Model_DB.UserData).filter(Model_DB.UserData.email == email).first()
    
def authenticate_user(password:str,password_plane:str):
    password_clena = password.split("#")[0]
    if password_clena == password_plane:
        return True
    else:
        return False
    
def create_token(data:dict):
    data_token = data.copy()
    data_token["exp"] = datetime.now(timezone.utc) + timedelta(seconds= TOKEN_SECONDS_EXP)
    token_jwt = jwt.encode(data_token,key=SECRETE_KEY,algorithm="HS256")
    return token_jwt

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return jinjatemplates.TemplateResponse("index.html", {"request": request})

# autenticacion de paginas 

@app.get("/autenticacion/dashboard",response_class=HTMLResponse)
def dashboard(request:Request,access_token:Annotated[str | None, Cookie()] = None,db: Session = Depends(get_db)):
    if access_token is None:
        return RedirectResponse("/",status_code=302)
    try:
        data_user = jwt.decode(access_token,key=SECRETE_KEY,algorithms=["HS256"])
        if get_user(data_user["email"],db) is None:
            return RedirectResponse("/",status_code=302)
        return jinjatemplates.TemplateResponse("dashboard.html",{"request":request})

    except JWTError:
        RedirectResponse("/",status_code=302)
        
        
@app.get("/autenticacion/data_users",response_class=HTMLResponse)
def dashboard(request:Request,access_token:Annotated[str | None, Cookie()] = None,db: Session = Depends(get_db)):
    if access_token is None:
        return RedirectResponse("/",status_code=302)
    try:
        data_user = jwt.decode(access_token,key=SECRETE_KEY,algorithms=["HS256"])
        if get_user(data_user["email"],db) is None:
            return RedirectResponse("/",status_code=302)
        return jinjatemplates.TemplateResponse("users-profile.html",{"request":request})

    except JWTError:
        RedirectResponse("/",status_code=302)
   
@app.get("/autenticacion/preguntas_frecuentes",response_class=HTMLResponse)
def dashboard(request:Request,access_token:Annotated[str | None, Cookie()] = None,db: Session = Depends(get_db)):
    if access_token is None:
        return RedirectResponse("/",status_code=302)
    try:
        data_user = jwt.decode(access_token,key=SECRETE_KEY,algorithms=["HS256"])
        if get_user(data_user["email"],db) is None:
            return RedirectResponse("/",status_code=302)
        return jinjatemplates.TemplateResponse("pages-faq.html",{"request":request})

    except JWTError:
        RedirectResponse("/",status_code=302)

@app.get("/autenticacion/publicar",response_class=HTMLResponse)
def dashboard(request:Request,access_token:Annotated[str | None, Cookie()] = None,db: Session = Depends(get_db)):
    if access_token is None:
        return RedirectResponse("/",status_code=302)
    try:
        data_user = jwt.decode(access_token,key=SECRETE_KEY,algorithms=["HS256"])
        if get_user(data_user["email"],db) is None:
            return RedirectResponse("/",status_code=302)
        return jinjatemplates.TemplateResponse("publicar.html",{"request":request})

    except JWTError:
        RedirectResponse("/",status_code=302)
        

@app.get("/autenticacion/pagina_contactos",response_class=HTMLResponse)
def dashboard(request:Request,access_token:Annotated[str | None, Cookie()] = None,db: Session = Depends(get_db)):
    if access_token is None:
        return RedirectResponse("/",status_code=302)
    try:
        data_user = jwt.decode(access_token,key=SECRETE_KEY,algorithms=["HS256"])
        if get_user(data_user["email"],db) is None:
            return RedirectResponse("/",status_code=302)
        return jinjatemplates.TemplateResponse("pages-contact.html",{"request":request})

    except JWTError:
        RedirectResponse("/",status_code=302)
        
# autenticacion de paginas 


@app.post("/autenticacion/login")
def login(email:Annotated[EmailStr,Form()],password:Annotated[str,Form()], db: Session = Depends(get_db) ):
    user_data = get_user(email,db)
    if user_data is None:
        raise HTTPException(
            status_code=401,
            detail="Email no authorization")
        
    if not authenticate_user(user_data.passwordHash,password):
        raise HTTPException(
            status_code=401,
            detail="password not authorization"
        )
    token = create_token({"email":user_data.email})
    
    return RedirectResponse(
        "/autenticacion/dashboard",
        status_code=302,
        headers={"set-cookie":f"access_token={token};Max-Age={TOKEN_SECONDS_EXP}"}
    )

@app.post("/autenticacion/logout")
def logout():
    return RedirectResponse("/",status_code=302,headers={
        "set-cookie":"access_token=;Max-Age=0"
        })

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000) 