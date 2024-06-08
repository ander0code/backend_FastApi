document.addEventListener('DOMContentLoaded', function() {
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

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);

    localStorage.setItem('email', payload.email);

    console.log(`Email guardado en localStorage: ${payload.email}`);

    const email = payload.email;

    fetch(`http://127.0.0.1:8000/users_nuevo/${encodeURIComponent(email)}`, {
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
        } else {
            console.error('No se encontraron todos los elementos necesarios para reemplazar los datos del perfil');
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
                        <div class="post-meta">por <span class="post-author"><a href="/users-profileOthers.html" class="goPerfil">${post.propietarioNombre || 'Autor no disponible'}</a></span> el ${post.fecha_Creacion ? new Date(post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible'}</div>
                    </div>
                    <div class="post-tags"></div>
                    <div class="post-footer">
                        <a href="/autenticacion/texto?post_id=${post.id}"><button class="redirect-button"><i class="bi bi-arrow-return-right"></i></button></a>
                        </div>
                </div>
            `;

            const tagsContainer = newPost.querySelector('.post-tags');
            tagsContainer.innerHTML = '';

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
        console.error('Error:', error);
    });
});
