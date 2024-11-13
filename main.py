from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import sys
sys.path.append("..")
from routers import Autenticacion,Publicaciones_Comentarios,Users,Etiqueta_Profesores,insertar_Publicaciones,insertar_comentario,insert_Votos,vistas,servicios



app = FastAPI(
    title="FORUA",
    description="PROYECTO 3 Ciclo - Programacion Avanzada",
    version="1.0.0")
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1:5501", 
    "http://127.0.0.1:5500",
    "https://fastapi-340032812084.us-central1.run.app"

]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/autenticacion/assets/vendor/bootstrap", StaticFiles(directory="frontend/assets/vendor/bootstrap"), name="bootstrap")
app.mount("/autenticacion/assets/vendor/bootstrap-icons", StaticFiles(directory="frontend/assets/vendor/bootstrap-icons"), name="bootstrap-icons")
app.mount("/autenticacion/assets/vendor/boxicons", StaticFiles(directory="frontend/assets/vendor/boxicons"), name="boxicons")
app.mount("/autenticacion/assets/vendor/quill", StaticFiles(directory="frontend/assets/vendor/quill"), name="quill")
app.mount("/autenticacion/assets/vendor/simple-datatables", StaticFiles(directory="frontend/assets/vendor/simple-datatables"), name="simple-datatables")
app.mount("/autenticacion/assets/vendor/remixicon", StaticFiles(directory="frontend/assets/vendor/remixicon"), name="remixicon")
app.mount("/autenticacion/assets/vendor/apexcharts", StaticFiles(directory="frontend/assets/vendor/apexcharts"), name="apexcharts")
app.mount("/autenticacion/assets/vendor/echarts", StaticFiles(directory="frontend/assets/vendor/echarts"), name="echarts")
app.mount("/autenticacion/assets/vendor/chart.js", StaticFiles(directory="frontend/assets/vendor/chart.js"), name="chart.js")
app.mount("/autenticacion/assets/vendor/tinymce", StaticFiles(directory="frontend/assets/vendor/tinymce"), name="tinymce")
app.mount("/autenticacion/assets/vendor/php-email-form", StaticFiles(directory="frontend/assets/vendor/php-email-form"), name="php-email-form")






app.mount("/autenticacion/assets/js", StaticFiles(directory="frontend/assets/js"), name="js_dashboard")
app.mount("/autenticacion/assets/img", StaticFiles(directory="frontend/assets/img"), name="img_dashboard")
app.mount("/autenticacion/assets/css", StaticFiles(directory="frontend/assets/css"), name="css_dashboard")



app.mount("/assets/js", StaticFiles(directory="frontend/assets/js"), name="js")

app.mount("/assets/js", StaticFiles(directory="frontend/assets/js"), name="js")
app.mount("/assets/img", StaticFiles(directory="frontend/assets/img"), name="img")
app.mount("/assets/css", StaticFiles(directory="frontend/assets/css"), name="css")

app.mount("/assets/vendor/bootstrap", StaticFiles(directory="frontend/assets/vendor/bootstrap"), name="bootstrap1")
app.mount("/assets/vendor/bootstrap-icons", StaticFiles(directory="frontend/assets/vendor/bootstrap-icons"), name="bootstrap-icons1")
app.mount("/assets/vendor/boxicons", StaticFiles(directory="frontend/assets/vendor/boxicons"), name="boxicons1")
app.mount("/assets/vendor/quill", StaticFiles(directory="frontend/assets/vendor/quill"), name="quill1")
app.mount("/assets/vendor/simple-datatables", StaticFiles(directory="frontend/assets/vendor/simple-datatables"), name="simple-datatables1")
app.mount("/assets/vendor/remixicon", StaticFiles(directory="frontend/assets/vendor/remixicon"), name="remixicon1")
app.mount("/assets/vendor/apexcharts", StaticFiles(directory="frontend/assets/vendor/apexcharts"), name="apexcharts1")
app.mount("/assets/vendor/echarts", StaticFiles(directory="frontend/assets/vendor/echarts"), name="echarts1")
app.mount("/assets/vendor/chart.js", StaticFiles(directory="frontend/assets/vendor/chart.js"), name="chart.js1")
app.mount("/assets/vendor/tinymce", StaticFiles(directory="frontend/assets/vendor/tinymce"), name="tinymce1")
app.mount("/assets/vendor/php-email-form", StaticFiles(directory="frontend/assets/vendor/php-email-form"), name="php-email-form1")
app.mount("/assets/vendor/bootstrap/css", StaticFiles(directory="frontend/assets/vendor/bootstrap/css"), name="ccsss")


app.include_router(Autenticacion.app, tags=["Login"])
app.include_router(Users.user, tags=["Users"])
app.include_router(Publicaciones_Comentarios.post, tags=["Post"])
app.include_router(Etiqueta_Profesores.Profe,tags=["Profe"])
app.include_router(insertar_Publicaciones.post,tags=["PostInsert"])
app.include_router(insertar_comentario.coment,tags=["ComentInsert"])
app.include_router(insert_Votos.voto ,tags=["Votos"])
app.include_router(vistas.vista ,tags=["Vistas"])
app.include_router(servicios.serv ,tags=["Servicios"])