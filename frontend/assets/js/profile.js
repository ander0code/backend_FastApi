document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const token = getCookie('access_token');

    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró el token en las cookies'
        });
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

    fetch(`https://fastapi-340032812084.us-central1.run.app/users_nuevo/${encodeURIComponent(email)}`, {
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

        if (Object.values(profileElements).every(el => el !== null)) {
            const userData = {
                id: user[0].id || 'N/A',
                nombre: user[0].nombre || 'N/A',
                lastName: user[0].last_Name || 'N/A',
                acercaDeMi: user[0].acerca_de_mi || 'N/A',
                carrera: user[0].carrera.etiquetaNombre || 'N/A',
                ciclo: user[0].ciclo || 'N/A',
                frase: user[0].puntos_de_vista || 'N/A',
                codigoID: user[0].codigo_user || 'N/A',
                fechaNacimiento: user[0].fecha_nacimiento || 'N/A',
                fotoUrl: user[0].usuariofoto || './assets/img/defaultft.webp'
            };

            profileElements.profileName.textContent = `${userData.nombre} ${userData.lastName}`;
            profileElements.profileName2.textContent = `${userData.nombre} ${userData.lastName}`;
            profileElements.aboutMe.textContent = userData.acercaDeMi;
            profileElements.profileCareer.textContent = userData.carrera;
            profileElements.profileCycle.textContent = userData.ciclo;
            profileElements.profilePhrase.textContent = userData.frase;
            profileElements.profileID.textContent = userData.codigoID;
            profileElements.profileBirthdate.textContent = userData.fechaNacimiento;
            profileElements.profilePhoto.src = userData.fotoUrl;

            // Guardar el ID del usuario en una variable global para usarlo en la actualización
            window.userId = userData.id;

            // Rellenar el modal con la información actual del usuario
            document.getElementById('editPhrase').value = userData.frase;
            document.getElementById('editDescription').value = userData.acercaDeMi;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontraron todos los elementos necesarios para reemplazar los datos del perfil'
            });
        }

        return fetch(`http://127.0.0.1:8000/posts/${user[0].id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener los posts del usuario');
        }
        return response.json();
    })
    .then(posts => {
        console.log('Posts recibidos:', posts);

        const postContainer = document.getElementById('post-container');
        postContainer.innerHTML = ''; // Limpiar el contenedor de posts

        posts.forEach(item => {
            const post = item;

            const newPost = document.createElement('div');
            newPost.classList.add('post-item');

            newPost.innerHTML = `
                <div class="post-left">
                    <div class="post-votes"><i class="bi bi-box2-heart-fill"></i> ${post.conteo_favoritos || 0} Votos</div>
                    <div class="post-replies"><i class="bi bi-chat-left-text"></i> ${post.recuento_comentarios || 0} Respuestas</div>
                    <div class="post-views"><i class="bi bi-eye-fill"></i> ${post.conteo_visitas || 0} Vistas</div>
                </div>
                <div class="post-right">
                    <div class="post-header">
                        <div class="post-title"><a href="/autenticacion/texto?post_id=${post.id}">${post.titulo || 'Título no disponible'}</a></div>
                        <div class="post-meta">por <span class="post-author"><a href="/autenticacion/perfils?id=${post.propietarioUserID}" class="goPerfil">${post.propietarioNombre || 'Autor no disponible'}</a></span> el ${post.fecha_Creacion || 'Fecha no disponible'}</div>
                    </div>
                    <div class="post-tags"></div>
                    <div class="post-footer">
                        <a href="/autenticacion/texto?post_id=${post.id}" class="post-readmore">Seguir Leyendo <i class="bi bi-arrow-right"></i></a>
                    </div>
                </div>
            `;

            const tagsContainer = newPost.querySelector('.post-tags');
            let hasTags = false;

            if (post.carrera && post.carrera.etiquetaNombre) {
                const carreraTag = document.createElement('span');
                carreraTag.textContent = post.carrera.etiquetaNombre;
                tagsContainer.appendChild(carreraTag);
                hasTags = true;
            }
            if (post.curso && post.curso.ciclo !== null) {
                const cicloTag = document.createElement('span');
                cicloTag.textContent = `Ciclo ${post.curso.ciclo}`;
                tagsContainer.appendChild(cicloTag);
                hasTags = true;
            }
            if (post.curso && post.curso.nombre_curso) {
                const cursoTag = document.createElement('span');
                cursoTag.textContent = post.curso.nombre_curso;
                tagsContainer.appendChild(cursoTag);
                hasTags = true;
            }

            if (!hasTags) {
                const generalTag = document.createElement('span');
                generalTag.textContent = 'General';
                tagsContainer.appendChild(generalTag);
            }

            postContainer.appendChild(newPost);
        });
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Ocurrió un error: ${error.message}`
        });
    });

    // Funciones para abrir y cerrar el modal
    window.openEditModal = function() {
        document.getElementById('editModal').style.display = 'block';
    }

    window.closeEditModal = function() {
        document.getElementById('editModal').style.display = 'none';
    }

    // Función para mostrar la alerta
    function mostrarAlerta() {
        Swal.fire({
            icon: 'success',
            title: 'Cambios guardados',
            text: 'La información se ha actualizado correctamente',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }

    // Función para guardar los cambios
    window.saveChanges = function() {
        const editPhrase = document.getElementById('editPhrase').value;
        const editDescription = document.getElementById('editDescription').value;

        const data = {
            PuntoDeVista: editPhrase,
            AcercaDeMi: editDescription
        };

        fetch(`http://127.0.0.1:8000/user_update_descripcion/${window.userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo actualizar la descripción del usuario');
            }
            return response.json();
        })
        .then(updatedUser => {
            console.log('Descripción del usuario actualizada:', updatedUser);
            document.getElementById('profile-phrase').textContent = updatedUser.puntos_de_vista;
                        document.getElementById('aboutme').textContent = updatedUser.acerca_de_mi;

            // Actualizar los campos del modal con los nuevos datos
            document.getElementById('editPhrase').value = updatedUser.puntos_de_vista;
            document.getElementById('editDescription').value = updatedUser.acerca_de_mi;

            mostrarAlerta(); // Mostrar la alerta
            closeEditModal(); // Cerrar el modal
            location.reload(); // Recargar la página
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al actualizar la descripción del usuario: ${error.message}`
            });
        });
    }
});
