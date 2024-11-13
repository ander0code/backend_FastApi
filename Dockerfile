# Usa una imagen ligera de Python
FROM python:3.11-slim

# Establece un directorio de trabajo
WORKDIR /app

# Instala las dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copia el archivo de dependencias
COPY requirements.txt .

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el contenido del proyecto al contenedor
COPY . .

# Exponer el puerto para la aplicación
EXPOSE 8000

# Ejecutar la aplicación usando uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]