document.addEventListener('DOMContentLoaded', () => {
    const carreraBtn = document.getElementById('carrera-btn');
    const cicloBtn = document.getElementById('ciclo-btn');
    const cursoBtn = document.getElementById('curso-btn');
    const limpiarBtn = document.getElementById('limpiar-btn');

    const carreraOptions = document.querySelectorAll('.carrera-option');
    const cicloOptions = document.querySelectorAll('.ciclo-option');
    const cursoOptions = document.querySelectorAll('.curso-option');

    const defaultCarreraText = 'Carrera';
    const defaultCicloText = 'Ciclo';
    const defaultCursoText = 'Curso';
     // Variables para paginación
     const postsPerPage = 7;
     let currentPosts = [];
     let currentPage = 1;

    let selectedCarrera = null;
    let selectedCiclo = null;
    let selectedCurso = null;

    cicloBtn.classList.add('disabled');
    cursoBtn.classList.add('disabled');

    // Inicializar opciones de carrera
    carreraOptions.forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCarrera = this.getAttribute('data-value');
            selectedCiclo = null;
            selectedCurso = null;

            document.querySelector('#ciclo-btn span').textContent = defaultCicloText;
            document.querySelector('#curso-btn span').textContent = defaultCursoText;
            document.querySelector('#carrera-btn span').textContent = this.querySelector('span').textContent;
            document.querySelector('#forms-nav').classList.remove('show');

            if (selectedCarrera === 'null') {
                cicloBtn.classList.add('disabled');
                cursoBtn.classList.add('disabled');
            } else {
                cicloBtn.classList.remove('disabled');
                cursoBtn.classList.add('disabled');
            }

            fetchAndDisplayPosts();
            closeDropdown(carreraBtn);
        });
    });

    // Inicializar opciones de ciclo
    cicloOptions.forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCiclo = this.getAttribute('data-value');
            selectedCurso = null;

            document.querySelector('#ciclo-btn span').textContent = this.querySelector('span').textContent;
            document.querySelector('#curso-btn span').textContent = defaultCursoText;
            cursoBtn.classList.add('disabled');

            fetchAndDisplayCursos();
            fetchAndDisplayPosts();
            closeDropdown(cicloBtn);
        });
    });

    // Actualizar botón de ciclo
    function updateCicloButton() {
        if (selectedCarrera && selectedCarrera !== 'null') {
            cicloBtn.classList.remove('disabled');
        } else {
            cicloBtn.classList.add('disabled');
        }
    }

    // Obtener y mostrar cursos
    function fetchAndDisplayCursos() {
        if (!selectedCarrera || !selectedCiclo) {
            console.error('Debe seleccionar una carrera y un ciclo antes de filtrar.');
            return;
        }

        const url = `https://fastapi-340032812084.us-central1.run.app/curso/${selectedCarrera}/${selectedCiclo}`;
        console.log(`Fetching cursos from URL: ${url}`);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los cursos');
                }
                return response.json();
            })
            .then(cursos => {
                const cursoNav = document.getElementById('forms-nav');
                cursoNav.innerHTML = '';

                if (!Array.isArray(cursos)) {
                    throw new Error('La respuesta no es un array');
                }

                if (cursos.length === 0) {
                    cursoNav.innerHTML = '<li>No se encontraron cursos</li>';
                    cursoBtn.classList.add('disabled');
                    return;
                }

                cursos.forEach(curso => {
                    const cursoItem = document.createElement('li');
                    cursoItem.innerHTML = `
                        <a href="#" class="curso-option" data-value="${curso.id_curso}">
                            <i class="bi bi-circle"></i><span>${curso.nombre_curso}</span>
                        </a>`;
                    cursoNav.appendChild(cursoItem);
                });

                cursoBtn.classList.remove('disabled');

                document.querySelectorAll('.curso-option').forEach(option => {
                    option.addEventListener('click', function(event) {
                        event.preventDefault();
                        const cursoName = this.querySelector('span').textContent;
                        cursoBtn.querySelector('span').textContent = cursoName;
                        selectedCurso = this.getAttribute('data-value');
                        console.log('Curso seleccionado:', selectedCurso);

                        document.querySelector('#forms-nav').classList.remove('show');
                        fetchAndDisplayPosts();
                        closeDropdown(cursoBtn);
                    });
                });
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
            });
    }

    // Obtener y mostrar posts basados en las selecciones de carrera, ciclo y curso
    function fetchAndDisplayPosts() {
        if (!selectedCarrera) {
            console.error('Debe seleccionar una carrera antes de filtrar.');
            return;
        }

        let url;
        if (selectedCarrera === 'null') {
            // Si la selección es "General", se usa el endpoint específico para posts generales
            url = `https://fastapi-340032812084.us-central1.run.app/posts_general`;
        } else {
            url = `https://fastapi-340032812084.us-central1.run.app/postsFilter/${selectedCarrera}`;
            if (selectedCiclo) {
                url += `/${selectedCiclo}`;
                if (selectedCurso) {
                    url += `/${selectedCurso}`;
                }
            }
        }

        console.log(`Fetching posts from URL: ${url}`);

        fetch(url)
            .then(response => {
                if (response.status === 404) {
                    return [];
                } else if (!response.ok) {
                    throw new Error('No se pudo obtener los posts');
                }
                return response.json();
            })
            .then(posts => {
                currentPosts = posts; // Guardar los posts actuales para la paginación
                currentPage = 1; // Reiniciar la página actual al obtener nuevos posts
                displayPosts(); // Mostrar los posts en la página
                setupPagination(); // Configurar la paginación
            })
            .catch(error => {
                console.error('Error al obtener los posts:', error);
            });
    }

    // Limpiar todos los botones y resetear selecciones
    limpiarBtn.addEventListener('click', () => {
        limpiarBtn.disabled = true; // Deshabilitar el botón de limpiar
        carreraBtn.querySelector('span').textContent = defaultCarreraText;
        cicloBtn.querySelector('span').textContent = defaultCicloText;
        cursoBtn.querySelector('span').textContent = defaultCursoText;

        cicloBtn.classList.add('disabled');
        cursoBtn.classList.add('disabled');

        selectedCarrera = null;
        selectedCiclo = null;
        selectedCurso = null;

        fetchAndDisplayAllPosts();

        closeDropdown(carreraBtn);
        closeDropdown(cicloBtn);
        closeDropdown(cursoBtn);
        
        setTimeout(() => {
            limpiarBtn.disabled = false; // Habilitar el botón de limpiar
        }, 5000); // 5000 milisegundos = 5 segundos
    });

    // Función para cerrar el dropdown después de una selección
    function closeDropdown(button) {
        const dropdown = button.nextElementSibling;
        if (dropdown.classList.contains('show')) {
            button.click();
        }
    }

    // Obtener y mostrar todos los posts al cargar la página
    fetchAndDisplayAllPosts();

    // Función para obtener y mostrar todos los posts
    function fetchAndDisplayAllPosts() {
        fetch('https://fastapi-340032812084.us-central1.run.app/posts_nuevo/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los posts');
                }
                return response.json();
            })
            .then(posts => {
                currentPosts = posts; // Guardar los posts actuales para la paginación
                currentPage = 1; // Reiniciar la página actual al obtener nuevos posts
                displayPosts(); // Mostrar los posts en la página
                setupPagination(); // Configurar la paginación
            })
            .catch(error => {
                console.error('Error al obtener los posts:', error);
            });
    }

    function countPostView(postId, redirectUrl) {
        const userEmail = localStorage.getItem('email');
    
        if (!userEmail) {
            console.error('No se encontró el correo del usuario logueado');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró el correo del usuario logueado',
            });
            return;
        }
    
        fetch(`https://fastapi-340032812084.us-central1.run.app/users_nuevo/${encodeURIComponent(userEmail)}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(userData => {
            if (userData.length === 0) {
                console.error('No se encontró el usuario con el correo proporcionado');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró el usuario con el correo proporcionado',
                });
                return;
            }
            const userId = userData[0].id;
    
            const url = `https://fastapi-340032812084.us-central1.run.app/vistas/${postId}/${userId}`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Vista contada:', data);
                window.location.href = redirectUrl;
            })
            .catch(error => {
                console.error('Error al contar la vista:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al contar la vista',
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener el usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener el usuario logueado',
            });
        });
    }
    
    
    

    function displayPosts(posts) {
        const postContainer = document.getElementById('post-container');
        const notfoundContainer = document.getElementById('notfound-container');
        const userEmail = localStorage.getItem('email');
    
        if (!userEmail) {
            console.error('No se encontró el correo del usuario logueado');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró el correo del usuario logueado',
            });
            return;
        }
    
        fetch(`https://fastapi-340032812084.us-central1.run.app/${encodeURIComponent(userEmail)}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(userData => {
            if (userData.length === 0) {
                console.error('No se encontró el usuario con el correo proporcionado');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró el usuario con el correo proporcionado',
                });
                return;
            }
            const userId = userData[0].id;
    
            postContainer.innerHTML = '';
    
            if (!Array.isArray(currentPosts) || currentPosts.length === 0) {
                notfoundContainer.style.display = 'block';
                postContainer.style.display = 'none';
            } else {
                notfoundContainer.style.display = 'none';
                postContainer.style.display = 'block';
    
                // Calcular el rango de posts a mostrar según la página actual
                const startIndex = (currentPage - 1) * postsPerPage;
                const endIndex = startIndex + postsPerPage;
                const postsToShow = currentPosts.slice(startIndex, endIndex);
    
                postsToShow.forEach(item => {
                    const post = item.post;
                    const carrera = item.carrera;
                    const curso = item.curso;
                    const votos = item.votos.cantidad;
    
                    const newPost = document.createElement('div');
                    newPost.classList.add('post-item');
    
                    newPost.innerHTML = `
                        <div class="post-left">
                            <div class="post-votes"><i class="bi bi-box2-heart-fill"></i> ${votos || 0} Votos</div>
                            <div class="post-replies"><i class="bi bi-chat-left-text"></i> ${post.recuento_comentarios || 0} Respuestas</div>
                            <div class="post-views"><i class="bi bi-eye-fill"></i> ${post.conteo_visitas || 0} Vistas</div>
                        </div>
                        <div class="post-right">
                            <div class="post-header">
                                <div class="post-title"><a href="/autenticacion/texto?post_id=${post.id}" class="post-link">${post.titulo || 'Título no disponible'}</a></div>
                                <div class="post-meta">por <span class="post-author"><a href="/autenticacion/perfils?id=${post.propietarioUserID}" class="goPerfil">${post.propietarioNombre || 'Autor no disponible'}</a></span> el ${post.fecha_Creacion || 'Fecha no disponible'}</div>
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
    
                    const postLink = newPost.querySelector('.post-link');
                    postLink.addEventListener('click', (event) => {
                        event.preventDefault();
                        const redirectUrl = `/autenticacion/texto?post_id=${post.id}`;
                        countPostView(post.id, redirectUrl);
                    });
    
                    const redirectButton = newPost.querySelector('.redirect-button');
                    redirectButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        const redirectUrl = `/autenticacion/texto?post_id=${post.id}`;
                        countPostView(post.id, redirectUrl);
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener el usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener el usuario logueado',
            });
        });
    }
    function setupPagination() {
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = '';

        const pageCount = Math.ceil(currentPosts.length / postsPerPage);
        if (pageCount > 1) {
            for (let i = 1; i <= pageCount; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    displayPosts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                paginationContainer.appendChild(pageButton);
            }
        }
    }
});    