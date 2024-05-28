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

    // Mostrar todos los posts al cargar la página
    fetchAndDisplayAllPosts();

    carreraOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            const carreraName = option.querySelector('span').textContent;
            carreraBtn.querySelector('span').textContent = carreraName;
            selectedCarrera = option.getAttribute('data-value');
            cicloBtn.classList.remove('disabled');
            cursoBtn.classList.add('disabled');
            cursoBtn.querySelector('span').textContent = defaultCursoText;
            selectedCiclo = null;
            selectedCurso = null;
            closeDropdown(carreraBtn);
            // Filtrar automáticamente al seleccionar una carrera
            fetchAndDisplayPosts(selectedCarrera, selectedCiclo, selectedCurso);
        });
    });

    cicloOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            const cicloName = option.querySelector('span').textContent;
            cicloBtn.querySelector('span').textContent = cicloName;
            selectedCiclo = option.getAttribute('data-value');
            cursoBtn.classList.remove('disabled');
            selectedCurso = null;
            closeDropdown(cicloBtn);
            // Filtrar automáticamente al seleccionar un ciclo
            fetchAndDisplayPosts(selectedCarrera, selectedCiclo, selectedCurso);
        });
    });

    cursoOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            const cursoName = option.querySelector('span').textContent;
            cursoBtn.querySelector('span').textContent = cursoName;
            selectedCurso = option.getAttribute('data-value');
            closeDropdown(cursoBtn);
            // Filtrar automáticamente al seleccionar un curso
            fetchAndDisplayPosts(selectedCarrera, selectedCiclo, selectedCurso);
        });
    });

    limpiarBtn.addEventListener('click', () => {
        carreraBtn.querySelector('span').textContent = defaultCarreraText;
        cicloBtn.querySelector('span').textContent = defaultCicloText;
        cursoBtn.querySelector('span').textContent = defaultCursoText;

        cicloBtn.classList.add('disabled');
        cursoBtn.classList.add('disabled');

        selectedCarrera = null;
        selectedCiclo = null;
        selectedCurso = null;

        closeDropdown(carreraBtn);
        closeDropdown(cicloBtn);
        closeDropdown(cursoBtn);

        // Mostrar todos los posts al limpiar los filtros
        fetchAndDisplayAllPosts();
    });

    function closeDropdown(button) {
        const dropdown = button.nextElementSibling;
        if (dropdown.classList.contains('show')) {
            button.click();
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
                displayPosts(posts);
            })
            .catch(error => {
                console.error('Error al obtener los posts:', error);
            });
    }

    function fetchAndDisplayPosts(selectedCarrera = null, selectedCiclo = null, selectedCurso = null) {
        if (!selectedCarrera) {
            console.error('Se debe seleccionar al menos una carrera');
            return;
        }

        let url = 'http://127.0.0.1:8000/posts';
        if (selectedCarrera) {
            url += `/${selectedCarrera}`;
            if (selectedCiclo) {
                url += `/${selectedCiclo}`;
                if (selectedCurso) {
                    url += `/${selectedCurso}`;
                }
            }
        }

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

    function displayPosts(posts) {
        const postContainer = document.getElementById('post-container');

        if (!Array.isArray(posts)) {
            throw new Error('La respuesta no es un array');
        }

        postContainer.innerHTML = '';

        posts.forEach(item => {
            const post = item.post;
            const carrera = item.carrera;
            const curso = item.curso;

            const newPost = document.createElement('div');
            newPost.classList.add('activity-item', 'd-flex', 'flex-column', 'p-2', 'mb-2', 'border');
            newPost.style.display = 'none'; // Para ocultar la plantilla

            newPost.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="activite-label post-date">${post.fecha_Creacion ? new Date(post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible'}</span>
                    <i class="bi bi-circle-fill activity-badge text-success align-self-start"></i>
                </div>
                <div class="activity-content">
                    <a href="#" class="fw-bold text-dark post-title">${post.titulo || 'Título no disponible'}</a>
                    <div class="text-muted">por <span class="post-author">${post.propietarioNombre || 'Autor no disponible'}</span></div>
                    <div class="post-tags"></div>
                </div>
                <div class="d-flex justify-content-between mt-2">
                    <span class="post-votes">${post.conteo_favoritos || 0} Favoritos</span>
                    <span class="post-replies">${post.recuento_comentarios || 0} Comentarios</span>
                    <span class="post-views">${post.conteo_visitas || 0} Visitas</span>
                </div>
            `;

            postContainer.appendChild(newPost);
            newPost.style.display = 'block'; // Para mostrar la publicación

            // Añadimos las etiquetas correspondientes
            const tagsContainer = newPost.querySelector('.post-tags');
            tagsContainer.innerHTML = '';

            let hasTags = false;

            if (carrera && carrera.etiquetaNombre) {
                const carreraTag = document.createElement('span');
                carreraTag.className = 'badge bg-primary text-light';
                carreraTag.textContent = carrera.etiquetaNombre;
                tagsContainer.appendChild(carreraTag);
                hasTags = true;
            }
            if (curso && curso.ciclo !== null) {
                const cicloTag = document.createElement('span');
                cicloTag.className = 'badge bg-warning text-dark';
                cicloTag.textContent = `Ciclo ${curso.ciclo}`;
                tagsContainer.appendChild(cicloTag);
                hasTags = true;
            }
            if (curso && curso.nombre_curso) {
                const cursoTag = document.createElement('span');
                cursoTag.className = 'badge bg-secondary text-light';
                cursoTag.textContent = curso.nombre_curso;
                tagsContainer.appendChild(cursoTag);
                hasTags = true;
            }

            // Añadir etiqueta general si no hay etiquetas de carrera, ciclo o curso
            if (!hasTags) {
                const generalTag = document.createElement('span');
                generalTag.className = 'badge bg-success text-light';
                generalTag.textContent = 'General';
                tagsContainer.appendChild(generalTag);
            }
        });
    }
});
