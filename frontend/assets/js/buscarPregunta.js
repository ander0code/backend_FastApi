document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('input[name="query"]');

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim().toLowerCase();

        if (query) {
            fetch(`http://127.0.0.1:8000/posts_nuevo/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudo obtener los posts');
                    }
                    return response.json();
                })
                .then(posts => {
                    const filteredPosts = posts.filter(post => post.post.titulo.toLowerCase().includes(query));
                    displayPosts(filteredPosts);
                })
                .catch(error => {
                    console.error('Error al buscar las preguntas:', error);
                });
        } else {
            fetchAndDisplayAllPosts();
        }
    });

    // Función para obtener y mostrar todos los posts al cargar la página
    function fetchAndDisplayAllPosts() {
        fetch('http://127.0.0.1:8000/posts_nuevo/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los posts');
                }
                return response.json();
            })
            .then(posts => {
                displayPosts(posts);
            })
            .catch(error => {
                console.error('Error al obtener los posts:', error);
            });
    }

    // Función para mostrar los posts en el contenedor
    function displayPosts(posts) {
        const postContainer = document.getElementById('post-container');
        const notfoundContainer = document.getElementById('notfound-container');

        postContainer.innerHTML = '';

        if (!Array.isArray(posts) || posts.length === 0) {
            notfoundContainer.style.display = 'block';
            postContainer.style.display = 'none';
        } else {
            notfoundContainer.style.display = 'none';
            postContainer.style.display = 'block';

            posts.forEach(item => {
                const post = item.post;
                const carrera = item.carrera;
                const curso = item.curso;
                const votos = item.votos;

                const newPost = document.createElement('div');
                newPost.classList.add('post-item');

                newPost.innerHTML = `
                    <div class="post-left">
                        <div class="post-votes"><i class="bi bi-box2-heart-fill"></i> ${votos.cantidad || 0} Votos</div>
                        <div class="post-replies"><i class="bi bi-chat-left-text"></i> ${post.recuento_comentarios || 0} Respuestas</div>
                        <div class="post-views"><i class="bi bi-eye-fill"></i> ${post.conteo_visitas || 0} Vistas</div>
                    </div>
                    <div class="post-right">
                        <div class="post-header">
                            <div class="post-title"><a href="/autenticacion/texto?post_id=${post.id}">${post.titulo || 'Título no disponible'}</a></div>
                            <div class="post-meta">por <span class="post-author"><a href="/users-profileOthers.html" class="goPerfil">${post.propietarioNombre || 'Autor no disponible'}</a></span> el ${post.fecha_Creacion || 'Fecha no disponible'}</div>
                        </div>
                        <div class="post-tags"></div>
                        <div class="post-footer">
                        <a href="/autenticacion/texto?post_id=${post.id}"><button class="redirect-button"><i class="fa-solid fa-arrow-right"></i></button></a>
                        </div>
                    </div>
                `;

                const tagsContainer = newPost.querySelector('.post-tags');
                tagsContainer.innerHTML = '';

                let hasTags = false;

                if (carrera && carrera.etiquetaNombre) {
                    const carreraTag = document.createElement('span');
                    carreraTag.textContent = carrera.etiquetaNombre;
                    tagsContainer.appendChild(carreraTag);
                    hasTags = true;
                }
                if (curso && curso.ciclo !== null) {
                    const cicloTag = document.createElement('span');
                    cicloTag.textContent = `Ciclo ${curso.ciclo}`;
                    tagsContainer.appendChild(cicloTag);
                    hasTags = true;
                }
                if (curso && curso.nombre_curso) {
                    const cursoTag = document.createElement('span');
                    cursoTag.textContent = curso.nombre_curso;
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
        }
    }

    // Obtener y mostrar todos los posts al cargar la página
    fetchAndDisplayAllPosts();
});
