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
            aboutMe: document.getElementById('aboutme'),
            profileCareer: document.getElementById('profile-career'),
            profileCycle: document.getElementById('profile-cycle'),
            profilePhrase: document.getElementById('profile-phrase'),
            profileID: document.getElementById('profile-id'),
            profileBirthdate: document.getElementById('profile-birthdate'),
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
                carrera: user[0].carrera.etiquetaNombre || 'N/A',
                ciclo: user[0].ciclo || 'N/A',
                frase: user[0].puntos_de_vista || 'N/A',
                codigoID: user[0].codigo_user || 'N/A',
                fechaNacimiento: user[0].fecha_nacimiento || 'N/A',
                fotoUrl: user[0].usuariofoto || './assets/img/defaultft.jpg'
            };

            console.log(`Nombre: ${userData.nombre}, Apellido: ${userData.lastName}, Acerca de mí: ${userData.acercaDeMi}, Carrera: ${userData.carrera}, Ciclo: ${userData.ciclo}, Frase: ${userData.frase}, Código ID: ${userData.codigoID}, Fecha de nacimiento: ${userData.fechaNacimiento}, Foto: ${userData.fotoUrl}`); // Verificar valores

            profileElements.profileName.textContent = `${userData.nombre} ${userData.lastName}`;
            profileElements.profileName2.textContent = `${userData.nombre} ${userData.lastName}`;
            profileElements.aboutMe.textContent = userData.acercaDeMi;
            profileElements.profileCareer.textContent = userData.carrera;
            profileElements.profileCycle.textContent = userData.ciclo;
            profileElements.profilePhrase.textContent = userData.frase;
            profileElements.profileID.textContent = userData.codigoID;
            profileElements.profileBirthdate.textContent = userData.fechaNacimiento;
            profileElements.profilePhoto.src = userData.fotoUrl;
        } else {
            console.error('No se encontraron todos los elementos necesarios para reemplazar los datos del perfil');
        }
    })
    .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
    });
});
