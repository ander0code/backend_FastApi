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
            document.getElementById('curso-btn').classList.add('disabled');
            document.querySelector('#ciclo-btn span').textContent = defaultCicloText;
            document.querySelector('#curso-btn span').textContent = defaultCursoText;
            document.querySelector('#carrera-btn span').textContent = this.querySelector('span').textContent;
            document.querySelector('#forms-nav').classList.remove('show');

            updateCicloButton();
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
            document.getElementById('curso-btn').classList.add('disabled');

            fetchAndDisplayCursos();
            fetchAndDisplayPosts();
            closeDropdown(cicloBtn);
        });
    });

    // Actualizar botón de ciclo
    function updateCicloButton() {
        if (selectedCarrera) {
            document.getElementById('ciclo-btn').classList.remove('disabled');
        } else {
            document.getElementById('ciclo-btn').classList.add('disabled');
        }
    }

    // Obtener y mostrar cursos
    function fetchAndDisplayCursos() {
        if (!selectedCarrera || !selectedCiclo) {
            console.error('Debe seleccionar una carrera y un ciclo antes de filtrar.');
            return;
        }

        const url = `http://127.0.0.1:8000/curso/${selectedCarrera}/${selectedCiclo}`;
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
                    document.getElementById('curso-btn').classList.add('disabled');
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

                document.getElementById('curso-btn').classList.remove('disabled');

                document.querySelectorAll('.curso-option').forEach(option => {
                    option.addEventListener('click', function(event) {
                        event.preventDefault();
                        const cursoName = this.querySelector('span').textContent;
                        document.getElementById('curso-btn').querySelector('span').textContent = cursoName;
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

        let url = `http://127.0.0.1:8000/posts/${selectedCarrera}`;
        if (selectedCiclo) {
            url += `/${selectedCiclo}`;
            if (selectedCurso) {
                url += `/${selectedCurso}`;
            }
        }

        console.log(`Fetching posts from URL: ${url}`);

        fetch(url)
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
        postContainer.innerHTML = '';

        if (!Array.isArray(posts)) {
            throw new Error('La respuesta no es un array');
        }

        posts.forEach(item => {
            const post = item.post;
            const carrera = item.carrera;
            const curso = item.curso;
            const votos = item.votos;

            const newPost = document.createElement('div');
            newPost.classList.add('post-item');

            newPost.innerHTML = `
                <div class="post-left">
                    <div class="post-votes"><i class="fa-solid fa-check-to-slot"></i>${votos.cantidad || 0} Votos</div>
                    <div class="post-replies"><i class="fa-solid fa-square-check"></i>${post.recuento_comentarios || 0} Respuestas</div>
                    <div class="post-views"><i class="fa-solid fa-eye"></i>${post.conteo_visitas || 0} Vistas</div>
                </div>
                <div class="post-right">
                    <div class="post-header">
                        <div class="post-title">${post.titulo || 'Título no disponible'}</div>
                        <div class="post-meta">por <span class="post-author">${post.propietarioNombre || 'Autor no disponible'}</span> el ${post.fecha_Creacion ? new Date(post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible'}</div>
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
});
