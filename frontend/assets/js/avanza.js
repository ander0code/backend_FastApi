// Función para llenar los contenedores en orden
function llenarContenedoresEnOrden() {
    var contenedorTitulo = document.getElementById('contenedorTitulo');
    var contenedorTexto = document.getElementById('contenedorTexto');
    var contenedorImagen = document.getElementById('contenedorImagen');

    // Primero llenar el contenedor del título
    if (contenedorTitulo && !contenedorTitulo.innerHTML.trim()) {
        contenedorTitulo.innerHTML = 'Este es el título';
    } else {
        // Si ya está lleno, activar el siguiente contenedor
        contenedorTexto.classList.remove('inactive');
    }

    // Si el contenedor de texto está lleno, activar el siguiente contenedor
    if (contenedorTexto && !contenedorTexto.innerHTML.trim()) {
        contenedorTexto.innerHTML = 'Este es el texto';
    } else {
        // Si ya está lleno, activar el siguiente contenedor
        contenedorImagen.classList.remove('inactive');
    }

    // Si el contenedor de imagen está lleno, activar el siguiente contenedor
    if (contenedorImagen && !contenedorImagen.innerHTML.trim()) {
        contenedorImagen.innerHTML = '<img src="ruta-de-la-imagen.jpg" alt="Imagen">';
    }
}

// Llamar a la función para llenar los contenedores en orden
llenarContenedoresEnOrden();
