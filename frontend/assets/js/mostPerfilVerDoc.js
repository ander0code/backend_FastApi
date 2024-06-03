document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener el valor de una cookie por su nombre
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

    // Decodificar el payload del token JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);

    // Almacenar el email en localStorage
    localStorage.setItem('email', payload.email);

    console.log(`Email guardado en localStorage: ${payload.email}`); // Verificar el email guardado

    const email = payload.email; // Obtener el email del payload del token

    fetch(`http://127.0.0.1:8000/users_nuevo/${encodeURIComponent(email)}`, {
        headers: {
            'Authorization': `Bearer ${token}` // Incluir el token en el encabezado de la solicitud
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener el perfil del usuario');
        }
        return response.json();
    })
    .then(user => {
        console.log('Datos del usuario recibidos:', user); // Verificar los datos recibidos

        const profileName = document.getElementById('profile-name');
        const profileFullname = document.getElementById('profile-fullname');
        const profileCarrer = document.getElementById('profile-carreer');
        const profileImg = document.getElementById('profile-img');

        if (profileName && profileFullname && profileCarrer && profileImg) {
            const nombre = user[0].nombre || 'N/A';
            const lastName = user[0].last_Name || 'N/A';
            const nombreCarrera = user[0].carrera.etiquetaNombre || 'N/A'; // Obtener el nombre de la carrera

            // Mapa de nombres de carrera a IDs de carrera
            const carrerasMap = {
                'Psicologia': 1,
                'Derecho': 2,
                // Agrega más carreras según sea necesario
            };

            const carreraId = carrerasMap[nombreCarrera]; // Obtener el ID de la carrera del mapa

            console.log(`Nombre: ${nombre}, Apellido: ${lastName}, Carrera: ${nombreCarrera}, ID de Carrera: ${carreraId}`); // Verificar valores

            profileName.textContent = `${nombre} ${lastName}`;
            profileFullname.textContent = `${nombre} ${lastName}`;
            profileCarrer.textContent = `Carrera: ${nombreCarrera}`;
            profileImg.src = user[0].usuariofoto || './assets/img/defaultft.jpg';

            // Obtener y mostrar los profesores de la carrera del usuario logueado
            fetchProfesores(carreraId);
        } else {
            throw new Error('No se encontraron los elementos para reemplazar los datos del perfil');
        }
    })
    .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
    });
});

// Función para obtener y mostrar los profesores de una carrera específica.
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
        })
        .catch(error => {
            console.error('Error al obtener los profesores:', error);
        });
}

// Función para mostrar los profesores en el contenedor
function displayProfesores(profesores) {
    const profesoresContainer = document.getElementById('profesores-container');
    profesoresContainer.innerHTML = '';

    if (!Array.isArray(profesores)) {
        throw new Error('La respuesta no es un array');
    }

    profesores.forEach(profesor => {
        const profesorCard = document.createElement('div');
        profesorCard.classList.add('col-12');
        profesorCard.innerHTML = `
            <div class="cardDoc">
                <div class="cardDetailsDoc">
                    <div class="postHeaderDoc">
                        <a href="/autenticacion/infdoc" class="textTitleDoc">${profesor.nombre_profesor}</a>
                    </div>
                    <div class="postMetaDoc">
                        <span class="textBodyDoc">${profesor.id_carrera === 1 ? 'Facultad de Psicología' : 'Facultad de Derecho'}</span>
                    </div>
                    <div class="postMetaDoc">
                        <span class="textBodyDoc">N°Calificaciones: ${profesor.calificaciones || 'N/A'}</span>
                    </div>
                    <div class="postMetaDoc">
                        <span class="textBodyDoc">Promedio: ${profesor.promedio || 'N/A'}</span>
                    </div>
                    <button class="cardButtonDoc"><a class="botonVerDoc" href="/autenticacion/infdoc">Ver Docente</a></button>
                </div>
            </div>
        `;

        profesoresContainer.appendChild(profesorCard);
    });
}
