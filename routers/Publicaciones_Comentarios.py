from fastapi import APIRouter,Depends,HTTPException,Query,Path
from sqlalchemy.orm import Session
from sqlalchemy import func, case ,desc
from models import Model_DB
from Schemas import Publicaciones,Comentarios
from config.base_connection import SessionLocal
from typing import Any,List

post = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
@post.get("/posts/{carrera_id}", response_model=List[Publicaciones.PostWithCurso])
async def post_carrera(carrera_id: int, db: Session = Depends(get_db)) -> Any:

    resultados = db.query(
        Model_DB.Post,
        Model_DB.EtiquetaCarrera,
        Model_DB.EtiquetaCurso,
        func.sum(case((Model_DB.Vote.tipo_Voto == 'POST', 1), else_=0)) - 
        func.sum(case((Model_DB.Vote.tipo_Voto == 'NEG', 1), else_=0)).label('votos')
        ).outerjoin(
            Model_DB.Vote,
            Model_DB.Vote.mensajeID == Model_DB.Post.id
        ).join(
            Model_DB.EtiquetasPublicacion,
            Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id
        ).join(
            Model_DB.EtiquetaCarrera,
            Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID
        ).outerjoin(
            Model_DB.EtiquetaCurso,
            Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID
        ).filter(
            Model_DB.EtiquetaCarrera.id_carrera == carrera_id
        ).group_by(
            Model_DB.Post.id,
            Model_DB.EtiquetaCarrera.id_carrera,
            Model_DB.EtiquetaCurso.id_curso
        ).order_by(desc(Model_DB.Post.id)).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Carrera no registrada - o no existe, no es la id de la carrera, fijate en la database imvecil")

    response = [
        Publicaciones.PostWithCurso(
            post=Publicaciones.PostBase.model_validate(post),
            carrera=Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
            curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None,
            votos=Publicaciones.VotosBase(
                cantidad=voto_cantidad
            )
        )
        for post, carrera, curso, voto_cantidad in resultados
    ]
    return response


@post.get("/curso/{carrera_id}/{ciclo}", response_model=None)
async def curso_carrera_ciclo(
    carrera_id: int ,
    ciclo: int ,
    db: Session = Depends(get_db)
) -> Any:
    resultados = db.query(
        Model_DB.EtiquetaCurso
        ).join(
            Model_DB.EtiquetaEtiquetaCurso,
            Model_DB.EtiquetaEtiquetaCurso.idcurso == Model_DB.EtiquetaCurso.id_curso
        ).join(
            Model_DB.EtiquetaCarrera,
            Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetaEtiquetaCurso.idcarrera
        ).filter(
            Model_DB.EtiquetaCarrera.id_carrera == carrera_id,
            Model_DB.EtiquetaCurso.ciclo == ciclo
        ).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="curso no encontrado")

    return resultados

@post.get("/posts/{carrera_id}/{ciclo}", response_model=List[Publicaciones.PostWithCurso])
async def post_carrera_ciclo(
    carrera_id: int ,
    ciclo: int ,
    db: Session = Depends(get_db)
) -> Any:

    resultados = db.query(
        Model_DB.Post,
        Model_DB.EtiquetaCarrera,
        Model_DB.EtiquetaCurso,
        func.sum(case((Model_DB.Vote.tipo_Voto == 'POST', 1), else_=0)) -
        func.sum(case((Model_DB.Vote.tipo_Voto == 'NEG', 1), else_=0)).label('votos')
        ).outerjoin(
            Model_DB.Vote,
            Model_DB.Vote.mensajeID == Model_DB.Post.id
        ).join(
            Model_DB.EtiquetasPublicacion,
            Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id
        ).join(
            Model_DB.EtiquetaCarrera,
            Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID
        ).join(
            Model_DB.EtiquetaCurso,
            Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID
        ).filter(
            Model_DB.EtiquetaCarrera.id_carrera == carrera_id,
            Model_DB.EtiquetaCurso.ciclo == ciclo
        ).group_by(
            Model_DB.Post.id,
            Model_DB.EtiquetaCarrera.id_carrera,
            Model_DB.EtiquetaCurso.id_curso
        ).order_by(desc(Model_DB.Post.id)).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Publicacion no encontrado")

    response = [
        Publicaciones.PostWithCurso(
            post=Publicaciones.PostBase.model_validate(post),
            carrera=Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
            curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None,
            votos=Publicaciones.VotosBase(
                cantidad=voto_cantidad
            )
        )
        for post, carrera, curso, voto_cantidad in resultados
    ]
    return response


@post.get("/posts/{carrera_id}/{ciclo}/{curso}",response_model=List[Publicaciones.PostWithCurso])

async def post_carrera_ciclo_curso(
    carrera_id: int ,
    ciclo: int ,
    curso: int,
    db: Session = Depends(get_db)
) -> Any:

    resultados = db.query(
        Model_DB.Post,
        Model_DB.EtiquetaCarrera,
        Model_DB.EtiquetaCurso,
        func.sum(case((Model_DB.Vote.tipo_Voto == 'POST', 1), else_=0)) -
        func.sum(case((Model_DB.Vote.tipo_Voto == 'NEG', 1), else_=0)).label('votos')
        ).outerjoin(
            Model_DB.Vote,
            Model_DB.Vote.mensajeID == Model_DB.Post.id
        ).join(
            Model_DB.EtiquetasPublicacion,
            Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id
        ).join(
            Model_DB.EtiquetaCarrera,
            Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID
        ).join(
            Model_DB.EtiquetaCurso,
            Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID
        ).filter(
            Model_DB.EtiquetaCarrera.id_carrera == carrera_id,
            Model_DB.EtiquetaCurso.ciclo == ciclo,
            Model_DB.EtiquetaCurso.id_curso == curso
        ).group_by(
            Model_DB.Post.id,
            Model_DB.EtiquetaCarrera.id_carrera,
            Model_DB.EtiquetaCurso.id_curso
        ).order_by(desc(Model_DB.Post.id)).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Publicacion no encontrado")

    response = [
        Publicaciones.PostWithCurso(
            post=Publicaciones.PostBase.model_validate(post),
            carrera=Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
            curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None,
            votos=Publicaciones.VotosBase(
                cantidad=voto_cantidad
            )
        )
        for post, carrera, curso, voto_cantidad in resultados
    ]
    return response

@post.get("/posts_x_postid/{id_post}",response_model=List[Publicaciones.PostWithCurso])
async def post_x_post_id(
    id_post: int ,
    db: Session = Depends(get_db)) -> Any:
    
    resultados = db.query(
        Model_DB.Post,
        Model_DB.EtiquetaCarrera,
        Model_DB.EtiquetaCurso,
        func.sum(case((Model_DB.Vote.tipo_Voto == 'POST', 1), else_=0)) -
        func.sum(case((Model_DB.Vote.tipo_Voto == 'NEG', 1), else_=0)).label('votos')
        ).outerjoin(
            Model_DB.Vote,
            Model_DB.Vote.mensajeID == Model_DB.Post.id
        ).outerjoin(
            Model_DB.EtiquetasPublicacion,
            Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id
        ).outerjoin(
            Model_DB.EtiquetaCarrera,
            Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID
        ).outerjoin(
            Model_DB.EtiquetaCurso,
            Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID
        ).filter(
            Model_DB.Post.id == id_post
        ).group_by(
            Model_DB.Post.id,
            Model_DB.EtiquetaCarrera.id_carrera,
            Model_DB.EtiquetaCurso.id_curso
        ).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Publicacion no encontrado")

    response = [
        Publicaciones.PostWithCurso(
            post=Publicaciones.PostBase.model_validate(post),
            carrera=Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
            curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None,
            votos=Publicaciones.VotosBase(
                cantidad=voto_cantidad
            )
        )
        for post, carrera, curso, voto_cantidad in resultados
    ]
    return response

@post.get("/comentario_x_idPost/{id_post}",response_model=List[Comentarios.ComentariosBase])
async def post_x_post_id(
    id_post: int ,
    db: Session = Depends(get_db)) -> Any:
    resultados = db.query(
        Model_DB.Comment ,
        Model_DB.User
    ).join(Model_DB.Post,
           Model_DB.Post.id == Model_DB.Comment.publicacion_ID
    ).join(Model_DB.User,
           Model_DB.User.id == Model_DB.Comment.userID
    ).filter(
        Model_DB.Comment.publicacion_ID == id_post
    ).order_by(desc(Model_DB.Comment.comentario_id)).all()
    
    if not resultados:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    
    response = [
        Comentarios.ComentariosBase(
            publicacion_ID=comment.publicacion_ID,
            padre_comentario_id = comment.padre_comentario_id, 
            texto = comment.texto,
            comentario_id = comment.comentario_id,
            puntuacion = comment.puntuacion,
            fecha_creacion = comment.fecha_creacion,
            userID = comment.userID,
            UserData = Comentarios.UserBase(
                nombre= user.nombre,
                last_Name= user.last_Name
            )
        )
        for comment, user in resultados
    ]
    return response


@post.get("/posts_general", response_model=List[Publicaciones.PostWithCurso])
async def post_general(
    db: Session = Depends(get_db)
) -> Any:
    resultados = db.query(
        Model_DB.Post,
        Model_DB.EtiquetaCarrera,
        Model_DB.EtiquetaCurso,
        func.sum(case((Model_DB.Vote.tipo_Voto == 'POST', 1), else_=0)) -
        func.sum(case((Model_DB.Vote.tipo_Voto == 'NEG', 1), else_=0)).label('votos')
        ).outerjoin(
            Model_DB.Vote,
            Model_DB.Vote.mensajeID == Model_DB.Post.id
        ).join(
            Model_DB.EtiquetasPublicacion,
            Model_DB.EtiquetasPublicacion.Comentario_ID == Model_DB.Post.id
        ).outerjoin(
            Model_DB.EtiquetaCarrera,
            Model_DB.EtiquetaCarrera.id_carrera == Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID
        ).outerjoin(
            Model_DB.EtiquetaCurso,
            Model_DB.EtiquetaCurso.id_curso == Model_DB.EtiquetasPublicacion.etiqueta_curso_ID
        ).filter(
            Model_DB.EtiquetasPublicacion.etiqueta_carrera_ID == None,
            Model_DB.EtiquetasPublicacion.etiqueta_curso_ID == None
        ).group_by(
            Model_DB.Post.id,
            Model_DB.EtiquetaCarrera.id_carrera,
            Model_DB.EtiquetaCurso.id_curso
        ).order_by(desc(Model_DB.Post.id)).all()

    if not resultados:
        raise HTTPException(status_code=404, detail="Publicacion no encontrado")

    response = [
        Publicaciones.PostWithCurso(
            post=Publicaciones.PostBase.model_validate(post),
            carrera=Publicaciones.EtiqetaCarreraBase.model_validate(carrera) if carrera else None,
            curso=Publicaciones.EtiquetaCursoBase.model_validate(curso) if curso else None,
            votos=Publicaciones.VotosBase(
                cantidad=voto_cantidad
            )
        )
        for post, carrera, curso, voto_cantidad in resultados
    ]
    return response