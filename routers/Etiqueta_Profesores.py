from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy import Integer
from models import Model_DB
from Schemas import Profesores
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
             
@Profe.get("/get_profesores/{id_carrera}}",response_model=List[Profesores.etiquetaprofeBase],
           description="Endpoint para obtener profesores por carrera. Acuerdate extraer primero el id de la carrera del usuario")
def get_profes_prueba(id_carrera = int  ,db: Session = Depends(get_db) )-> Any:
    resultados = db.query(
        Model_DB.EtiquetaProfesores.id,
        Model_DB.EtiquetaProfesores.nombre_profesor,
        Model_DB.EtiquetaProfesores.id_carrera,
        func.avg(Model_DB.Calificacion.calidad).label("calidad_promedio"),
        func.avg(Model_DB.Calificacion.dificultad).label("dificultad_promedio"),
        func.sum(Model_DB.Calificacion.recomendacion.cast(Integer)).label("recomendaciones_total"),
        func.count(Model_DB.Calificacion.id).label("numero_total")
            ).outerjoin(
                Model_DB.Calificacion,
                Model_DB.Calificacion.id_rol_PRO == Model_DB.EtiquetaProfesores.id      
            ).join(
                Model_DB.EtiquetaCarrera,
                Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetaProfesores.id_carrera                
            ).filter(
                Model_DB.EtiquetaProfesores.id_carrera  == id_carrera
            ).group_by(
                Model_DB.EtiquetaProfesores.id
            ).all()
    if not resultados:
        raise HTTPException(status_code=404, detail="buscando porfesores por carrear: no existe ")
    
    response = [
        Profesores.etiquetaprofeBase(
            id=profesor.id,
            nombre_Profesor=profesor.nombre_profesor,
            id_carrera=profesor.id_carrera,
            datos_ex=[Profesores.Pag1CuestionarioBase(
                calidad_total=round(profesor.calidad_promedio, 2) if profesor.calidad_promedio is not None else 0,
                numero_total=profesor.numero_total,
                recomendacion_porcen=round((profesor.recomendaciones_total / profesor.numero_total) * 100, 2) if profesor.numero_total > 0 else 0,
                dificultad_total=round(profesor.dificultad_promedio, 2) if profesor.dificultad_promedio is not None else 0
            )]
        )
        for profesor in resultados
    ]
    return response


# @Profe.get("/get_profesores/{id_carrera}}", response_model=List[Profesores.etiquetaprofeBase],
#            description="Endpoint para obtener profesores por carrera. Acuerdate extraer primero el id de la carrera del usuario")
# def get_profes(id_carrera: int, db: Session = Depends(get_db)) -> Any:
#     resultados = db.query(
#         Model_DB.EtiquetaProfesores,
#         Model_DB.Calificacion
#     ).outerjoin(
#         Model_DB.Calificacion,
#         Model_DB.Calificacion.id_rol_PRO == Model_DB.EtiquetaProfesores.id      
#     ).filter(
#         Model_DB.EtiquetaProfesores.id_carrera == id_carrera
#     ).all()
    
#     if not resultados:
#         raise HTTPException(status_code=404, detail="Buscando profesores por carrera: no existe")
    
#     profesores_dict = {}
    
#     for profes, cali in resultados:
#         if profes.id not in profesores_dict:
#             profesores_dict[profes.id] = Profesores.etiquetaprofeBase(
#                 id=profes.id,
#                 nombre_Profesor=profes.nombre_profesor,
#                 id_carrera=profes.id_carrera,
#                 datos_ex=[]
#             )
        
#         if cali:
#             cuestionario = Profesores.CuestionarioBase(
#                 id_rol_STD=cali.id_rol_STD,
#                 ciclo=cali.ciclo,
#                 nombreCurso=cali.nombreCurso,
#                 calidad=cali.calidad,
#                 dificultad=cali.dificultad,
#                 etiquetas=cali.etiquetas,
#                 recomendacion=cali.recomendacion,
#                 texto=cali.texto
#             )
#             profesores_dict[profes.id].datos_ex.append(cuestionario)
    
#     response = list(profesores_dict.values())
#     return response





