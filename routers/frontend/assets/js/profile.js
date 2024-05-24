document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8000/users/')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener los perfiles de usuario');
            }
            return response.json();
        })
        .then(users => {
            const profileContainer = document.getElementById('profile-container');
            const profileTemplate = document.getElementById('profile-template');

            if (!profileContainer || !profileTemplate) {
                throw new Error('No se encontraron los elementos del contenedor de perfiles o la plantilla');
            }

            users.forEach(user => {
                const newProfile = profileTemplate.cloneNode(true);
                newProfile.style.display = 'block'; // Mostrar el nuevo perfil
                newProfile.removeAttribute('id'); // Eliminar el ID para evitar duplicados

                // Reemplazar los marcadores de posición con los datos del perfil de usuario
                newProfile.innerHTML = newProfile.innerHTML
                    .replace('{{nombre}}', user.nombre || 'N/A')
                    .replace('{{last_name}}', user.last_name || 'N/A')
                    .replace('{{nombre2}}', user.nombre || 'N/A')
                    .replace('{{last_name2}}', user.last_name || 'N/A')
                    .replace('{{nombre3}}', user.nombre || 'N/A')
                    .replace('{{last_name3}}', user.last_name || 'N/A')
                    .replace('{{acerca_de_mi}}', user.acerca_de_mi || 'N/A')
                    .replace('{{puntos_de_vista}}', user.puntos_de_vista || 'N/A')
                    .replace('{{codigo_ID}}', user.codigo_ID || 'N/A')
                    .replace('{{fecha_creacion}}', user.fecha_creacion ? new Date(user.fecha_creacion).toLocaleDateString() : 'N/A')
                    .replace('{{votos_positivos}}', user.votos_positivos || '0')
                    .replace('{{votos_negativos}}', user.votos_negativos || '0');

                profileContainer.appendChild(newProfile);
            });

            // Eliminar la plantilla original después de usarla
            profileTemplate.remove();
        })
        .catch(error => {
            console.error('Error al obtener los perfiles de usuario:', error);
        });
});
