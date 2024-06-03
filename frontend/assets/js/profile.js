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

        const profileElements = {
            profileName: document.getElementById('profile-name'),
            profileName2: document.getElementById('profile-name2'),
            profileName3: document.getElementById('profile-name3'),
            profileLastName2: document.getElementById('profile-last-name2'),
            profileAbout: document.getElementById('profile-about'),
            profileViews: document.getElementById('profile-views'),
            profileCareer: document.getElementById('profile-career'),
            profileID: document.getElementById('profile-id'),
            profilePosVotes: document.getElementById('profile-pos-votes'),
            profileNegVotes: document.getElementById('profile-neg-votes'),
            profileCreationDate: document.getElementById('profile-creation-date'),
            profilePhoto: document.getElementById('profile-photo')
        };

        for (let key in profileElements) {
            if (!profileElements[key]) {
                console.error(`No se encontró el elemento: ${key}`);
            }
        }

        if (Object.values(profileElements).every(el => el !== null)) {
            const userData = {
                nombre: user[0].nombre || 'N/A',
                lastName: user[0].last_Name || 'N/A',
                acercaDeMi: user[0].acerca_de_mi || 'N/A',
                codigoID: user[0].codigo_user || 'N/A',
                puntosDeVista: user[0].puntos_de_vista || 'N/A',
                profileCarrera: user[0].carrera.etiquetaNombre || 'N/A',
                votosPositivos: user[0].votos_positivos || 0,
                votosNegativos: user[0].votos_negativos || 0,
                fechaCreacion: user[0].fecha_creación || 'N/A',
                fotoUrl: user[0].usuariofoto || './assets/img/defaultft.jpg'
            };

            console.log(`Nombre: ${userData.nombre}, Apellido: ${userData.lastName}, Acerca de mí: ${userData.acercaDeMi}, Código ID: ${userData.codigoID}, Puntos de vista: ${userData.puntosDeVista}, Votos positivos: ${userData.votosPositivos}, Votos negativos: ${userData.votosNegativos}, Fecha de creación: ${userData.fechaCreacion}, Foto: ${userData.fotoUrl}`); // Verificar valores

            profileElements.profileName.textContent = userData.nombre;
            profileElements.profileName2.textContent = userData.nombre;
            profileElements.profileName3.textContent = userData.nombre;
            profileElements.profileLastName2.textContent = userData.lastName;
            profileElements.profileAbout.textContent = userData.acercaDeMi;
            profileElements.profileID.textContent = userData.codigoID;
            profileElements.profileViews.textContent = userData.puntosDeVista;
            profileElements.profileCareer.textContent = userData.profileCarrera;
            profileElements.profilePosVotes.textContent = userData.votosPositivos;
            profileElements.profileNegVotes.textContent = userData.votosNegativos;
            profileElements.profileCreationDate.textContent = userData.fechaCreacion;
            profileElements.profilePhoto.src = userData.fotoUrl;
        } else {
            console.error('No se encontraron todos los elementos necesarios para reemplazar los datos del perfil');
        }
    })
    .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
    });
});
