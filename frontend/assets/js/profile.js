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

    fetch(`http://127.0.0.1:8000/users/${encodeURIComponent(email)}`, {
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
        const profileName2 = document.getElementById('profile-name2');
        const profileLastName = document.getElementById('profile-last-name');
        const profileLastName2 = document.getElementById('profile-last-name2');
        const profileAbout = document.getElementById('profile-about');
        const profileViews = document.getElementById('profile-views');
        const profileID = document.getElementById('profile-id');
        const profileCreationDate = document.getElementById('profile-creation-date');
        const profilePosVotes = document.getElementById('profile-pos-votes');
        const profileNegVotes = document.getElementById('profile-neg-votes');

        if (profileName && profileName2 && profileLastName && profileLastName2 && profileAbout && profileViews && profileID && profileCreationDate && profileNegVotes && profilePosVotes) {
            // Asignar valores a las variables
            profileName.textContent = user[0].nombre || 'N/A';
            profileName2.textContent = user[0].nombre || 'N/A';
            profileLastName.textContent = user[0].last_Name || 'N/A';
            profileLastName2.textContent = user[0].last_Name || 'N/A';
            profileAbout.textContent = user[0].acerca_de_mi || 'N/A';
            profileViews.textContent = user[0].puntos_de_vista || 'N/A';
            profileID.textContent = user[0].codigo_ID || 'N/A';
            profileCreationDate.textContent = user[0].fecha_creación ? new Date(user[0].fecha_creación).toLocaleDateString() : 'N/A';
            profilePosVotes.textContent = user[0].votos_positivos || '0';
            profileNegVotes.textContent = user[0].votos_negativos || '0';
        } else {
            throw new Error('No se encontraron los elementos para reemplazar los datos del perfil');
        }
    })
    .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
    });
});


