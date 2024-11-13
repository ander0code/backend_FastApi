# Usa la imagen ligera de Python
FROM python:3.11

# Configura el directorio de trabajo
WORKDIR /app

# Instala dependencias del sistema (si necesitas algo adicional)
RUN apt-get update && apt-get install -y gcc && apt-get clean

# Copia los requisitos y la aplicación
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Exponer el puerto donde correrá la app
EXPOSE 8000

# Ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
