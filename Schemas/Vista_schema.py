from pydantic import BaseModel

class vista_model(BaseModel):
    
     vistas: int = None
    
class Response(vista_model):
    
    event : str
    response : str
    