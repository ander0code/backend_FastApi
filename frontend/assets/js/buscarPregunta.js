document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('input[name="query"]');
    let allPosts = [];

    searchInput.addEventListener('input', debounce(handleSearchInput, 300));

    function handleSearchInput() {
        const query = searchInput.value.trim().toLowerCase();

        if (query) {
            const filteredPosts = allPosts.filter(post => post.post.titulo.toLowerCase().includes(query));
            displayPosts(filteredPosts);
        } else {
            displayPosts(allPosts);
        }
    }

    function fetchAndDisplayAllPosts() {
        fetch('http://127.0.0.1:8000/posts_nuevo/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los posts');
                }
                return response.json();
            })
            .then(posts => {
                allPosts = posts;
                displayPosts(posts);
            })
            .catch(error => {
                console.error('Error al obtener los posts:', error);
            });
    }

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
                             <div class="post-title"><a href="/autenticacion/texto?post_id=${post.id}" class="delayed-link">${post.titulo || 'Título no disponible'}</a></div>
                            <div class="post-meta">por <span class="post-author"><a href="/autenticacion/perfils" class="goPerfil">${post.propietarioNombre || 'Autor no disponible'}</a></span> el ${post.fecha_Creacion || 'Fecha no disponible'}</div>
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

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    const postContainer = document.getElementById('post-container');

    // Función para manejar el bloqueo del enlace
    function handleDelayedLinkClick(event) {
        const link = event.target;

        // Verificar si se hizo clic en un enlace diferido
        if (link.classList.contains('delayed-link')) {
            // Bloquear el enlace por 3 segundos
            link.classList.add('disabled');
            setTimeout(() => {
                link.classList.remove('disabled');
            }, 2000);
        }
    }
    
     // Función para manejar el bloqueo del botón en el enlace
     function handleRedirectButtonClick(event) {
        const button = event.target.closest('.redirect-button');

        if (button) {
            // Bloquear el botón por 2 segundos
            button.disabled = true;
            setTimeout(() => {
                button.disabled = false;
            }, 2000);
        }
    }

    // Agregar el event listener al contenedor de posts
    postContainer.addEventListener('click', handleRedirectButtonClick);
    // Agregar el event listener al contenedor de posts
    postContainer.addEventListener('click', handleDelayedLinkClick);

    fetchAndDisplayAllPosts();
});