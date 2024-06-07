from sqlalchemy import Column,Integer, String, Date, Enum, ForeignKey ,Boolean
from sqlalchemy.orm import  relationship
from config.base_connection import Base

class UserData(Base):
    __tablename__ = 'user_Data'
    id= Column(Integer, primary_key=True,autoincrement=True)
    fecha_creación = Column(Date, nullable=False)
    location= Column(String(10))
    email= Column(String(45), nullable=False, unique=True)
    passwordHash= Column(String(45), nullable=False)
    rol= Column(Enum("MOD", "STD","PRO"), nullable=False)
    codigo_std = Column(Integer)
    
    user = relationship("User", back_populates="user_data")
    calificaciones = relationship("Calificacion", back_populates="student")
    
class User(Base):
    __tablename__ = 'user'
    id= Column(Integer, primary_key=True,autoincrement=True)
    fecha_creación = Column(Date, nullable=False)
    nombre= Column(String(45))
    last_Name= Column(String(45))
    acerca_de_mi= Column(String(100000))
    puntos_de_vista= Column(String(100000))
    votos_positivos= Column(Integer)
    votos_negativos= Column(Integer)
    usuariofoto = Column(String(255))
    codigo_ID= Column(Integer, ForeignKey('user_Data.id'), nullable=False)

    etiqueta_usuario = relationship("EtiquetaUsuario", back_populates="user") 
    historial_Post =  relationship("HistorialPost", back_populates="user")
    votes = relationship("Vote", back_populates="user")
    user_data = relationship("UserData", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    
    def __repr__(self):
        return (f"<User(id={self.id}, nombre='{self.nombre}', last_name='{self.last_name}', "
                f"fecha_creacion='{self.fecha_creación}', acerca_de_mi='{self.acerca_de_mi[:30]}...', "
                f"puntos_de_vista='{self.puntos_de_vista[:30]}...', votos_positivos={self.votos_positivos}, "
                f"votos_negativos={self.votos_negativos}, usuariofoto={self.usuariofoto}, "
                f"codigo_ID={self.codigo_ID})>")
    
class Post(Base):
    __tablename__ = 'post'
    id= Column(Integer, primary_key=True,autoincrement=True)
    fecha_Creacion = Column(Date, nullable=False)
    conteo_visitas= Column(Integer, nullable=False)
    propietarioUserID= Column(Integer, ForeignKey('user.id'), nullable=False)
    propietarioNombre= Column(String(30), nullable=True)
    ultimoEditorUserlD= Column(Integer, ForeignKey('user.id'), nullable=False)
    ultimoEditorName= Column(String(45), nullable=True)
    recuento_comentarios= Column(Integer, nullable=False)
    conteo_respuestas= Column(Integer, nullable=False)
    conteo_favoritos= Column(Integer, nullable=False)
    status= Column(Integer, nullable=False)
    titulo= Column(String(300))
    descripcion= Column(String(1000000))
    
    etiquetas_publicacion = relationship("EtiquetasPublicacion",back_populates="post")
    historial_Post =  relationship("HistorialPost", back_populates="post")
    votes = relationship("Vote", back_populates="post")
    comments = relationship("Comment", back_populates="post")

class Comment(Base):
    __tablename__ = 'comments'
    comentario_id= Column(Integer, primary_key=True,autoincrement=True)
    publicacion_ID= Column(Integer, ForeignKey('post.id'), nullable=False)
    padre_comentario_id= Column(Integer, ForeignKey('comments.comentario_id'), nullable=True)
    puntuacion= Column(Integer)
    texto= Column(String(1000000))
    userID= Column(Integer, ForeignKey('user.id'), nullable=False)
    usuarioName = Column(String(45))
    fecha_creacion = Column(Date)
    
    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
    parent_comment = relationship("Comment", remote_side=[comentario_id])

class Vote(Base):
    __tablename__ = 'votes'
    id= Column(Integer, primary_key=True,autoincrement=True)
    mensajeID= Column(Integer, ForeignKey('post.id'), nullable=False)
    tipo_Voto= Column(Enum("POST", "NEG"), nullable=False)
    userID= Column(Integer, ForeignKey('user.id'), nullable=False)
    
    user = relationship("User", back_populates="votes")
    post = relationship("Post", back_populates="votes")

class HistorialPost(Base):
    __tablename__ = 'historial_Post'
    id= Column(Integer, primary_key=True,autoincrement=True)
    id_mensaje= Column(Integer, ForeignKey('post.id'), nullable=False)
    id_usuario= Column(Integer, ForeignKey('user.id'), nullable=False)
    fecha_creación = Column(Date)
    usuario_nombre= Column(String(45))
    titulo= Column(String(300))
    descripcion= Column(String(1000000))
    
    user = relationship("User", back_populates="historial_Post")
    post = relationship("Post", back_populates="historial_Post")

class EtiquetaCarrera(Base):
    __tablename__ = 'etiqueta_carrera'
    id_carrera= Column(Integer, primary_key=True,autoincrement=True)
    etiquetaNombre= Column(String(45))
    contarEtiquetas= Column(Integer)
    descripccion= Column(String(10000000))
    
    etiqueta_usuario = relationship("EtiquetaUsuario", back_populates="etiqueta_carrera")
    etiquetas_publicacion = relationship("EtiquetasPublicacion",back_populates="etiqueta_carrera")
    etiqueta_etiqueta_curso = relationship("EtiquetaEtiquetaCurso",back_populates="etiqueta_carrera")
    etiqueta_profesores = relationship("EtiquetaProfesores",back_populates="etiqueta_carreraV2")
    
class EtiquetaCurso(Base):
    __tablename__ = 'etiquetaCurso'
    id_curso= Column(Integer, primary_key=True,autoincrement=True)
    nombre_curso= Column(String(250))
    ciclo= Column(Integer)
    
    etiquetas_publicacion = relationship("EtiquetasPublicacion",back_populates="etiqueta_curso")
    etiqueta_etiqueta_curso = relationship("EtiquetaEtiquetaCurso",back_populates="etiqueta_curso")
    

class EtiquetasPublicacion(Base):
    __tablename__ = 'etiquetas_publicacion'
    Comentario_ID= Column(Integer, ForeignKey('post.id'), primary_key=True)
    etiqueta_carrera_ID= Column(Integer, ForeignKey('etiqueta_carrera.id_carrera'))
    etiqueta_curso_ID= Column(Integer, ForeignKey('etiquetaCurso.id_curso'))
    
    post = relationship("Post", back_populates="etiquetas_publicacion")
    etiqueta_carrera = relationship("EtiquetaCarrera", back_populates="etiquetas_publicacion")
    etiqueta_curso = relationship("EtiquetaCurso", back_populates="etiquetas_publicacion")

class EtiquetaUsuario(Base):
    __tablename__ = 'etiqueta_usuario'
    etiquetaUserID= Column(Integer, ForeignKey('user.id'), primary_key=True)
    etiquetaID= Column(Integer, ForeignKey('etiqueta_carrera.id_carrera'), primary_key=True)
    
    etiqueta_carrera = relationship("EtiquetaCarrera", back_populates="etiqueta_usuario")
    user = relationship("User", back_populates="etiqueta_usuario")

class EtiquetaEtiquetaCurso(Base):
    __tablename__ = 'etiqueta_EtiquetaCurso'
    idcarrera= Column(Integer, ForeignKey('etiqueta_carrera.id_carrera'), primary_key=True)
    idcurso= Column(Integer, ForeignKey('etiquetaCurso.id_curso'), primary_key=True)
    
    etiqueta_carrera = relationship("EtiquetaCarrera", back_populates="etiqueta_etiqueta_curso")
    etiqueta_curso = relationship("EtiquetaCurso", back_populates="etiqueta_etiqueta_curso")
    
    
class EtiquetaProfesores(Base):
    __tablename__ = 'etiqueta_profesor'
    id = Column(Integer, primary_key=True,autoincrement=True)
    nombre_profesor = Column(String(100))
    id_carrera = Column(Integer, ForeignKey('etiqueta_carrera.id_carrera'),primary_key=True)
    
    etiqueta_carreraV2 = relationship("EtiquetaCarrera", back_populates="etiqueta_profesores")
    calificaciones = relationship("Calificacion", back_populates="profesor")
    
class Calificacion(Base):
    __tablename__ = 'calificacion' 
    id = Column(Integer, primary_key=True,autoincrement=True)
    id_rol_STD = Column(Integer,ForeignKey('user_Data.id'),primary_key=True)
    id_rol_PRO = Column(Integer,ForeignKey('etiqueta_profesor.id'),primary_key=True)
    ciclo = Column(Integer)
    nombreCurso = Column(String(250))
    calidad = Column(Integer)
    dificultad = Column(Integer)
    etiquetas = Column(String(500))
    recomendacion = Column(Boolean)   
    texto = Column(String(10000)) 
    

    student = relationship("UserData", back_populates="calificaciones")
    profesor = relationship("EtiquetaProfesores", back_populates="calificaciones")