document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const profesorId = urlParams.get('id');

    if (!profesorId) {
        console.error('No se encontró el ID del profesor en la URL');
        return;
    }

    function fetchProfesorDetails(id) {
        return fetch(`http://127.0.0.1:8000/get_profesores_ID/${id}`, {
            headers: {
                'accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener los detalles del profesor');
            }
            return response.json();
        });
    }

    function fetchProfesorComments(id) {
        return fetch(`http://127.0.0.1:8000/get_comments_profesores/${id}`, {
            headers: {
                'accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener las calificaciones del profesor');
            }
            return response.json();
        });
    }

    function updateProfesorInfo(profesor) {
        const promedioContainer = document.querySelector('.promedio-container .promedio strong');
        const nombreElement = document.querySelector('.profesor-info .nombre strong');
        const facultadElement = document.querySelector('.profesor-info .facultad');
        const porcentajeElement = document.querySelector('.porcentaje-dificultad .porcentaje strong');
        const dificultadElement = document.querySelector('.porcentaje-dificultad .dificultad strong');
        const numCalificacionesElement = document.getElementById('num-calificaciones');
        const calificarBtn = document.querySelector('.calificar-btn');
    
        if (profesor && profesor.datos_ex && profesor.datos_ex.length > 0) {
            const datosEx = profesor.datos_ex[0];
    
            promedioContainer.textContent = datosEx.calidad_total.toFixed(1);
            nombreElement.textContent = profesor.nombre_Profesor;
            facultadElement.textContent = profesor.id_carrera === 1 ? 'Psicología' : 'Derecho';
            porcentajeElement.textContent = `${datosEx.recomendacion_porcen}%`;
            dificultadElement.textContent = datosEx.dificultad_total.toFixed(1);
            numCalificacionesElement.textContent = `Basado en ${datosEx.numero_total} calificaciones`;
    
            // Update the href attribute of the calificar button
            calificarBtn.closest('a').href = `/autenticacion/califDoc?id=${profesor.id}`;
        }
    }

    function updateProfesorComments(comments) {
        const calificacionesEstudiantesSection = document.querySelector('.calificaciones-estudiantes');
        const etiquetasContainer = document.getElementById('etiquetas-container');
        const clasificacionTable = document.getElementById('clasificacion-table');
    
        let etiquetasMap = {};
        let clasificacionCounts = {
            EXCELENTE: 0,
            BUENO: 0,
            ACEPTABLE: 0,
            CONFUSO: 0,
            MUY_CONFUSO: 0
        };
    
        comments.forEach(comment => {
            comment.datos_ex.forEach(datos => { // Iterar sobre todos los comentarios
                const calificacionDiv = document.createElement('div');
                calificacionDiv.classList.add('calificacion');
        
                const calidadDificultadContainer = document.createElement('div');
                calidadDificultadContainer.classList.add('calidad-dificultad-container');
        
                const calidadDiv = document.createElement('div');
                calidadDiv.classList.add('calidad-resp');
                
                // Definir el color según el valor de calidad
                let colorCalidad;
                let textColor = '#000000'; // Color de texto predeterminado (negro)
                switch (datos.calidad) {
                    case 5:
                        colorCalidad = '#02B207'; // Verde
                        break;
                    case 4:
                        colorCalidad = '#B2FF00'; // Lima
                        break;
                    case 3:
                        colorCalidad = '#FFF300'; // Amarillo
                        textColor = '#000000'; // Cambiar texto a negro para calidad 3
                        break;
                    case 2:
                        colorCalidad = '#FF5500'; // Naranja
                        break;
                    case 1:
                        colorCalidad = '#FF0000'; // Rojo
                        break;
                    default:
                        colorCalidad = '#b6b5b2'; // Gris por defecto
                        break;
                }
        
                calidadDiv.innerHTML = `
                    <p class="label"><span>CALIDAD</span></p>
                    <div class="valor-container valor-calidad" style="background-color: ${colorCalidad}; color: ${textColor};">${datos.calidad}</div>
                `;
        
                const dificultadDiv = document.createElement('div');
                dificultadDiv.classList.add('dificultad-resp');
                dificultadDiv.innerHTML = `
                    <p class="label"><span>DIFICULTAD</span></p>
                    <div class="valor-container valor-dificultad">${datos.dificultad}</div>
                `;
        
                calidadDificultadContainer.appendChild(calidadDiv);
                calidadDificultadContainer.appendChild(dificultadDiv);
        
                const contenidoContainer = document.createElement('div');
                contenidoContainer.classList.add('contenido-container');
        
                const fechaP = document.createElement('p');
                fechaP.classList.add('fecha-comentario');
                fechaP.textContent = datos.fecha || 'Fecha desconocida';
        
                const tomariaDenuevoP = document.createElement('p');
                tomariaDenuevoP.classList.add('tomaria-denuevo');
                tomariaDenuevoP.innerHTML = `<strong>Tomaría de nuevo:</strong> ${datos.recomendacion ? 'SI' : 'NO'}`;
        
                const textoP = document.createElement('p');
                textoP.classList.add('texto-comentario');
                textoP.textContent = datos.texto;
        
                contenidoContainer.appendChild(fechaP);
                contenidoContainer.appendChild(tomariaDenuevoP);
                contenidoContainer.appendChild(textoP);
        
                const etiquetasContainerDiv = document.createElement('div');
                etiquetasContainerDiv.classList.add('etiquetas-container');
                datos.etiquetas.forEach(etiqueta => {
                    const spanEtiqueta = document.createElement('span');
                    spanEtiqueta.classList.add('etiqueta-resp');
                    spanEtiqueta.textContent = etiqueta;
                    etiquetasContainerDiv.appendChild(spanEtiqueta);
        
                    if (etiquetasMap[etiqueta]) {
                        etiquetasMap[etiqueta]++;
                    } else {
                        etiquetasMap[etiqueta] = 1;
                    }
                });
        
                contenidoContainer.appendChild(etiquetasContainerDiv);
        
                calificacionDiv.appendChild(calidadDificultadContainer);
                calificacionDiv.appendChild(contenidoContainer);
        
                calificacionesEstudiantesSection.appendChild(calificacionDiv);

        
                // Clasificación
                const calidad = datos.calidad;
                if (calidad >= 4.5) {
                    clasificacionCounts.EXCELENTE++;
                } else if (calidad >= 3.5) {
                    clasificacionCounts.BUENO++;
                } else if (calidad >= 2.5) {
                    clasificacionCounts.ACEPTABLE++;
                } else if (calidad >= 1.5) {
                    clasificacionCounts.CONFUSO++;
                } else {
                    clasificacionCounts.MUY_CONFUSO++;
                }
            });
        });
    
        // Actualizar etiquetas
        etiquetasContainer.innerHTML = '';
        Object.keys(etiquetasMap).forEach(etiqueta => {
            const spanEtiqueta = document.createElement('span');
            spanEtiqueta.classList.add('etiqueta');
            spanEtiqueta.textContent = `${etiqueta} (${etiquetasMap[etiqueta]})`;
            etiquetasContainer.appendChild(spanEtiqueta);
        });
    
        // Actualizar clasificación
        const rows = clasificacionTable.querySelectorAll('tr');
        rows[0].querySelector('.bar').style.width = `${(clasificacionCounts.EXCELENTE / comments.length) * 100}%`;
        rows[0].querySelector('.count').textContent = clasificacionCounts.EXCELENTE;
        rows[1].querySelector('.bar').style.width = `${(clasificacionCounts.BUENO / comments.length) * 100}%`;
        rows[1].querySelector('.count').textContent = clasificacionCounts.BUENO;
        rows[2].querySelector('.bar').style.width = `${(clasificacionCounts.ACEPTABLE / comments.length) * 100}%`;
        rows[2].querySelector('.count').textContent = clasificacionCounts.ACEPTABLE;
        rows[3].querySelector('.bar').style.width = `${(clasificacionCounts.CONFUSO / comments.length) * 100}%`;
        rows[3].querySelector('.count').textContent = clasificacionCounts.CONFUSO;
        rows[4].querySelector('.bar').style.width = `${(clasificacionCounts.MUY_CONFUSO / comments.length) * 100}%`;
        rows[4].querySelector('.count').textContent = clasificacionCounts.MUY_CONFUSO;
    }

    Promise.all([fetchProfesorDetails(profesorId), fetchProfesorComments(profesorId)])
        .then(([profesorDetails, profesorComments]) => {
            updateProfesorInfo(profesorDetails[0]);
            updateProfesorComments(profesorComments);
        })
        .catch(error => {
            console.error('Error al obtener los datos del profesor:', error);
        });
});