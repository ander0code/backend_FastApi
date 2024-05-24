document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8000/users/')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener los perfiles de usuario');
            }
            return response.json();
        })
        .then(users => {
            if (users.length === 0) {
                throw new Error('No se encontraron usuarios en la respuesta de la API');
            }

            const user = users[0]; // Tomamos el primer usuario
            const profileName = document.getElementById('profile-name');
            const profileFullname = document.getElementById('profile-fullname');
            const profileId = document.getElementById('profile-id');

            if (profileName && profileFullname && profileId) {
                profileName.textContent = `${user.nombre || 'N/A'} ${user.last_name || 'N/A'}`;
                profileFullname.textContent = `${user.nombre || 'N/A'} ${user.last_name || 'N/A'}`;
                profileId.textContent = `${user.id || 'N/A'}`;
            } else {
                throw new Error('No se encontraron los elementos para reemplazar los datos del perfil');
            }
        })
        .catch(error => {
            console.error('Error al obtener los perfiles de usuario:', error);
        });
});
