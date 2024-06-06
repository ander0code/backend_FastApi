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

    fetch(`http://127.0.0.1:8000/users_nuevo/${encodeURIComponent(email)}`, {
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
            profileImg.src = user[0].usuariofoto || './assets/img/defaultft.jpg';

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
    const url = `http://127.0.0.1:8000/get_profesores/${carreraId}%7D`;

    console.log(`Fetching profesores from URL: ${url}`);

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
            displayProfesores(profesores);
            addSearchFunctionality(profesores); // Agregar funcionalidad de búsqueda aquí
        })
        .catch(error => {
            console.error('Error al obtener los profesores:', error);
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
        profesorCard.innerHTML = `
            <div class="calidad-container">
                <div class="calidad-texto">CALIDAD</div>
                <div class="calidad">${profesor.calidad}</div>
                <div class="calificaciones">${profesor.calificaciones || 'N/A'} CALIFICACIONES</div>
            </div>
            <div class="info">
                <h2 class="nombre-profesor"><a href="/autenticacion/infdoc">${profesor.nombre_profesor}</a></h2>
                <p>${profesor.id_carrera === 1 ? 'Psicología' : 'Derecho'}</p>
                <p><strong>${profesor.porcentaje_tomara_de_nuevo}%</strong> tomará de nuevo | <strong>${profesor.nivel_dificultad}</strong> nivel de dificultad</p>
            </div>
        `;

        profesoresList.appendChild(profesorCard);
    });
}

function addSearchFunctionality(profesores) {
    const searchInput = document.getElementById('search-profesores');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProfesores = profesores.filter(profesor => 
            profesor.nombre_profesor.toLowerCase().includes(searchTerm)
        );
        displayProfesores(filteredProfesores);
    });
}
