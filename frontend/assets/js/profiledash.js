document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('email'); // Obtener el email almacenado

    if (!email) {
        console.error('No se encontró el email en localStorage');
        return;
    }

    const token = localStorage.getItem('token');

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
        const profileFullname = document.getElementById('profile-fullname');
        const profileId = document.getElementById('profile-id');

        if (profileName && profileFullname && profileId) {
            const nombre = user.nombre || 'N/A';
            const lastName = user.last_Name || 'N/A';
            const id = user.id || 'N/A';

            console.log(`Nombre: ${nombre}, Apellido: ${lastName}, ID: ${id}`); // Verificar valores

            profileName.textContent = `${nombre} ${lastName}`;
            profileFullname.textContent = `${nombre} ${lastName}`;
            profileId.textContent = `ID: ${id}`;
        } else {
            throw new Error('No se encontraron los elementos para reemplazar los datos del perfil');
        }
    })
    .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
    });
});