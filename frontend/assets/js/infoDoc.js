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

        if (profesor && profesor.datos_ex && profesor.datos_ex.length > 0) {
            const datosEx = profesor.datos_ex[0];

            promedioContainer.textContent = datosEx.calidad_total.toFixed(1);
            nombreElement.textContent = profesor.nombre_Profesor;
            facultadElement.textContent = profesor.id_carrera === 1 ? 'Psicología' : 'Derecho';
            porcentajeElement.textContent = `${datosEx.recomendacion_porcen}%`;
            dificultadElement.textContent = datosEx.dificultad_total.toFixed(1);
            numCalificacionesElement.textContent = `Basado en ${datosEx.numero_total} calificaciones`;
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
    
                const calidadDificultadDiv = document.createElement('div');
                calidadDificultadDiv.classList.add('calidad-dificultad');
    
                const calidadDiv = document.createElement('div');
                calidadDiv.classList.add('calidad');
                calidadDiv.innerHTML = `<p class="label">CALIDAD</p><p class="valor">${datos.calidad}</p>`;
    
                const dificultadDiv = document.createElement('div');
                dificultadDiv.classList.add('dificultad');
                dificultadDiv.innerHTML = `<p class="label">DIFICULTAD</p><p class="valor">${datos.dificultad}</p>`;
    
                calidadDificultadDiv.appendChild(calidadDiv);
                calidadDificultadDiv.appendChild(dificultadDiv);
    
                const tomariaDenuevoP = document.createElement('p');
                tomariaDenuevoP.classList.add('tomaria-denuevo');
                tomariaDenuevoP.innerHTML = `<strong>Tomaría de nuevo:</strong> ${datos.recomendacion ? 'SI' : 'NO'}`;
    
                const textoP = document.createElement('p');
                textoP.textContent = datos.texto;
    
                const fechaP = document.createElement('p');
                fechaP.classList.add('fecha');
                fechaP.textContent = 'Fecha desconocida';
    
                const etiquetasContainerDiv = document.createElement('div');
                etiquetasContainerDiv.classList.add('etiquetas-container');
                datos.etiquetas.forEach(etiqueta => {
                    const spanEtiqueta = document.createElement('span');
                    spanEtiqueta.classList.add('etiqueta');
                    spanEtiqueta.textContent = etiqueta;
                    etiquetasContainerDiv.appendChild(spanEtiqueta);
    
                    if (etiquetasMap[etiqueta]) {
                        etiquetasMap[etiqueta]++;
                    } else {
                        etiquetasMap[etiqueta] = 1;
                    }
                });
    
                calificacionDiv.appendChild(calidadDificultadDiv);
                calificacionDiv.appendChild(tomariaDenuevoP);
                calificacionDiv.appendChild(textoP);
                calificacionDiv.appendChild(fechaP);
                calificacionDiv.appendChild(etiquetasContainerDiv);
    
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
