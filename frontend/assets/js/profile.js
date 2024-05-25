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

                // Obtener los elementos de perfil del nuevo perfil clonado
                const profileName = newProfile.querySelector('.profile-name');
                const profileLastName = newProfile.querySelector('.profile-last-name');
                const profileAbout = newProfile.querySelector('.profile-about');
                const profileViews = newProfile.querySelector('.profile-views');
                const profileID = newProfile.querySelector('.profile-id');
                const profileCreationDate = newProfile.querySelector('.profile-creation-date');
                const profilePosVotes = newProfile.querySelector('.profile-pos-votes');
                const profileNegVotes = newProfile.querySelector('.profile-neg-votes');

                // Asignar valores a los elementos de perfil
                profileName.textContent = user.nombre || 'N/A';
                profileLastName.textContent = user.last_name || 'N/A';
                profileAbout.textContent = user.acerca_de_mi || 'N/A';
                profileViews.textContent = user.puntos_de_vista || 'N/A';
                profileID.textContent = user.codigo_ID || 'N/A';
                profileCreationDate.textContent = user.fecha_creacion ? new Date(user.fecha_creacion).toLocaleDateString() : 'N/A';
                profilePosVotes.textContent = user.votos_positivos || '0';
                profileNegVotes.textContent = user.votos_negativos || '0';

                profileContainer.appendChild(newProfile);
            });

            // Eliminar la plantilla original después de usarla
            profileTemplate.remove();
        })
        .catch(error => {
            console.error('Error al obtener los perfiles de usuario:', error);
        });
});
