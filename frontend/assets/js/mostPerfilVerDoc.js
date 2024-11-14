document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const token = getCookie('access_token');

    if (!token) {
        console.error('No se encontró el token en las cookies');
        return;
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);

    localStorage.setItem('email', payload.email);

    console.log(`Email guardado en localStorage: ${payload.email}`);

    const email = payload.email;

    fetch(`https://fastapi-340032812084.us-central1.run.app/users_nuevo/${encodeURIComponent(email)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener el perfil del usuario');
        }
        return response.json();
    })
    .then(user => {
        console.log('Datos del usuario recibidos:', user);

        const profileName = document.getElementById('profile-name');
        const profileFullname = document.getElementById('profile-fullname');
        const profileCarrer = document.getElementById('profile-carreer');
        const profileImg = document.getElementById('profile-img');

        if (profileName && profileFullname && profileCarrer && profileImg) {
            const nombre = user[0].nombre || 'N/A';
            const lastName = user[0].last_Name || 'N/A';
            const nombreCarrera = user[0].carrera.etiquetaNombre || 'N/A';

            const carrerasMap = {
                'Psicologia': 1,
                'Derecho': 2,
            };

            const carreraId = carrerasMap[nombreCarrera];

            console.log(`Nombre: ${nombre}, Apellido: ${lastName}, Carrera: ${nombreCarrera}, ID de Carrera: ${carreraId}`);

            profileName.textContent = `${nombre} ${lastName}`;
            profileFullname.textContent = `${nombre} ${lastName}`;
            profileCarrer.textContent = `Carrera: ${nombreCarrera}`;
            profileImg.src = user[0].usuariofoto || './assets/img/defaultft.webp';

            fetchProfesores(carreraId);
        } else {
            throw new Error('No se encontraron los elementos para reemplazar los datos del perfil');
        }
    })
    .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
    });
});

function fetchProfesores(carreraId) {
    const url = `http://127.0.0.1:8000/get_profesores/${carreraId}}`;

    console.log(`Obteniendo profesores desde la URL: ${url}`);

    fetch(url)
        .then(response => {
            console.log(`Estado de la respuesta: ${response.status}`);
            if (!response.ok) {
                throw new Error('No se pudo obtener los profesores');
            }
            return response.json();
        })
        .then(profesores => {
            console.log('Profesores recibidos:', profesores);
            // Ordena los profesores por calidad y dificultad de mayor a menor
            profesores.sort((a, b) => {
                return (b.datos_ex[0]?.calidad_total || 0) - (a.datos_ex[0]?.calidad_total || 0) ||
                       (b.datos_ex[0]?.dificultad_total || 0) - (a.datos_ex[0]?.dificultad_total || 0);
            });
            displayTopDocentes(profesores);
            displayProfesores(profesores); // Esta función muestra los docentes en otra parte del HTML
            addSearchFunctionality(profesores);
        })
        .catch(error => {
            console.error('Error al obtener los profesores:', error);
        });
}

function displayTopDocentes(profesores) {
    const topDocentesContainer = document.getElementById('top-docentes-container');
    if (!topDocentesContainer) {
        console.error('No se encontró el contenedor de los top docentes');
        return;
    }
    topDocentesContainer.innerHTML = '';

    if (!Array.isArray(profesores)) {
        throw new Error('La respuesta no es un array');
    }

    const top5Profesores = profesores
        .sort((a, b) => {
            return (b.datos_ex[0]?.calidad_total || 0) - (a.datos_ex[0]?.calidad_total || 0) ||
                   (b.datos_ex[0]?.dificultad_total || 0) - (a.datos_ex[0]?.dificultad_total || 0);
        })
        .slice(0, 3); // Obtener solo los primeros 5 docentes

    // Agregar el título "Top Docentes"
    const tituloTopDocentes = document.createElement('h2');
    tituloTopDocentes.textContent = 'Top Docentes';
    topDocentesContainer.appendChild(tituloTopDocentes);

    top5Profesores.forEach((profesor, index) => {
        const calidadTotal = profesor.datos_ex[0]?.calidad_total || 'N/A';
        const numeroTotal = profesor.datos_ex[0]?.numero_total || 'N/A';
        const recomendacionPorcen = profesor.datos_ex[0]?.recomendacion_porcen || 'N/A';
        const dificultadTotal = profesor.datos_ex[0]?.dificultad_total || 'N/A';

        const calidadBackgroundColor = getCalidadBackgroundColor(calidadTotal);

        const topProfesor = document.createElement('div');
        topProfesor.classList.add('top-profesor');
        topProfesor.innerHTML = `
            <div class="calidad-container">
                <div class="calidad-texto">CALIDAD</div>
                <div class="calidad" style="background-color: ${calidadBackgroundColor}; color: ${getTextColorForBackground(calidadBackgroundColor)};">${calidadTotal}</div>
                <div class="calificaciones">${numeroTotal} CALIFICACIONES</div>
            </div>
            <div class="info">
                <h2 class="nombre-profesor"><a href="/autenticacion/infdoc?id=${profesor.id}">${profesor.nombre_Profesor}</a></h2>
                <p>${profesor.id_carrera === 1 ? 'Psicología' : 'Derecho'}</p>
                <p><strong>${recomendacionPorcen}%</strong> tomará de nuevo | <strong>${dificultadTotal}</strong> nivel de dificultad</p>
            </div>
        `;
        topDocentesContainer.appendChild(topProfesor);
    });
}




function displayProfesores(profesores) {
    const profesoresList = document.getElementById('profesores-list');
    if (!profesoresList) {
        console.error('No se encontró el contenedor de la lista de profesores');
        return;
    }
    profesoresList.innerHTML = '';

    if (!Array.isArray(profesores)) {
        throw new Error('La respuesta no es un array');
    }

    profesores.forEach(profesor => {
        const profesorCard = document.createElement('div');
        profesorCard.classList.add('profesor');
        
        const calidadTotal = profesor.datos_ex[0]?.calidad_total || 'N/A';
        const numeroTotal = profesor.datos_ex[0]?.numero_total || 'N/A';
        const recomendacionPorcen = profesor.datos_ex[0]?.recomendacion_porcen || 'N/A';
        const dificultadTotal = profesor.datos_ex[0]?.dificultad_total || 'N/A';

        const calidadBackgroundColor = getCalidadBackgroundColor(calidadTotal);

        profesorCard.innerHTML = `
            <div class="calidad-container">
                <div class="calidad-texto">CALIDAD</div>
                <div class="calidad" style="background-color: ${calidadBackgroundColor}; color: ${getTextColorForBackground(calidadBackgroundColor)};">${calidadTotal}</div>
                <div class="calificaciones">${numeroTotal} CALIFICACIONES</div>
            </div>
            <div class="info">
                <h2 class="nombre-profesor"><a href="/autenticacion/infdoc?id=${profesor.id}">${profesor.nombre_Profesor}</a></h2>
                <p>${profesor.id_carrera === 1 ? 'Psicología' : 'Derecho'}</p>
                <p><strong>${recomendacionPorcen}%</strong> tomará de nuevo | <strong>${dificultadTotal}</strong> nivel de dificultad</p>
            </div>
        `;

        
        profesoresList.appendChild(profesorCard);
    });
}

function getCalidadBackgroundColor(calidad) {
    if (calidad >= 1 && calidad <= 1.9) {
        return '#FF0000';
    } else if (calidad >= 2 && calidad <= 2.9) {
        return '#FF5500';
    } else if (calidad === 3) {
        return '#FFF300';
    } else if (calidad >= 3.1 && calidad <= 3.9) {
        return '#B2FF00';
    } else if (calidad >= 4 && calidad <= 5) {
        return '#02B207';
    } else {
        return '#9b9b9b'; // Color de fondo predeterminado en caso de valor fuera de rango
    }
}

function getTextColorForBackground(backgroundColor) {
    const color = backgroundColor.substring(1); // elimina el '#'
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminosidad > 0.5 ? '#333333' : '#FFFFFF';
}

function addSearchFunctionality(profesores) {
    const searchInput = document.getElementById('search-profesores');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProfesores = profesores.filter(profesor => 
            profesor.nombre_Profesor.toLowerCase().includes(searchTerm)
        );
        displayProfesores(filteredProfesores);
    });
}
