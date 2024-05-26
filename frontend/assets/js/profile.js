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
        const profileAbout = document.getElementById('profile-about');
        const profilePointsOfView = document.getElementById('profile-points-of-view');
        const profilePositiveVotes = document.getElementById('profile-positive-votes');
        const profileNegativeVotes = document.getElementById('profile-negative-votes');
        const profilePhoto = document.getElementById('profile-photo');

        if (profileName && profileFullname && profileCarrer && profileAbout && profilePointsOfView && profilePositiveVotes && profileNegativeVotes && profilePhoto) {
            const nombre = user[0].nombre || 'N/A';
            const lastName = user[0].last_Name || 'N/A';
            const carreer = user[0].carrera.etiquetaNombre || 'N/A';
            const acercaDeMi = user[0].acerca_de_mi || 'N/A';
            const puntosDeVista = user[0].puntos_de_vista || 'N/A';
            const votosPositivos = user[0].votos_positivos || 0;
            const votosNegativos = user[0].votos_negativos || 0;
            const fotoUrl = user[0].usuariofoto || 'default-profile-photo-url'; // URL por defecto si no hay foto

            console.log(`Nombre: ${nombre}, Apellido: ${lastName}, Carrera: ${carreer}, Acerca de mí: ${acercaDeMi}, Puntos de vista: ${puntosDeVista}, Votos positivos: ${votosPositivos}, Votos negativos: ${votosNegativos}, Foto: ${fotoUrl}`); // Verificar valores

            profileName.textContent = `${nombre} ${lastName}`;
            profileFullname.textContent = `${nombre} ${lastName}`;
            profileCarrer.textContent = `Carrera: ${carreer}`;
            profileAbout.textContent = `Acerca de mí: ${acercaDeMi}`;
            profilePointsOfView.textContent = `Puntos de vista: ${puntosDeVista}`;
            profilePositiveVotes.textContent = `Votos positivos: ${votosPositivos}`;
            profileNegativeVotes.textContent = `Votos negativos: ${votosNegativos}`;
            profilePhoto.src = fotoUrl; // Asignar la URL de la foto
        } else {
            throw new Error('No se encontraron los elementos para reemplazar los datos del perfil');
        }
    })
    .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
    });
});
