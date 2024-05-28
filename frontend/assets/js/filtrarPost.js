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
            selectedCiclo = null; // Resetear ciclo cuando se selecciona una nueva carrera
            selectedCurso = null; // Resetear curso cuando se selecciona una nueva carrera
            document.getElementById('curso-btn').classList.add('disabled');
            document.querySelector('#ciclo-btn span').textContent = defaultCicloText; // Resetear texto del botón ciclo
            document.querySelector('#curso-btn span').textContent = defaultCursoText; // Resetear texto del botón curso
            document.querySelector('#carrera-btn span').textContent = this.querySelector('span').textContent; // Actualizar texto del botón carrera
            document.querySelector('#forms-nav').classList.remove('show'); // Cerrar el dropdown de curso
    
            updateCicloButton();
            fetchAndDisplayPosts(); // Actualizar los posts al seleccionar carrera
            closeDropdown(carreraBtn);
        });
    });
    


    // Inicializar opciones de ciclo
    cicloOptions.forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCiclo = this.getAttribute('data-value');
            selectedCurso = null; // Resetear curso cuando se selecciona un nuevo ciclo
    
            document.querySelector('#ciclo-btn span').textContent = this.querySelector('span').textContent; // Actualizar texto del botón ciclo
            document.querySelector('#curso-btn span').textContent = defaultCursoText; // Resetear texto del botón curso
            document.getElementById('curso-btn').classList.add('disabled'); // Deshabilitar botón de curso
    
            fetchAndDisplayCursos(); // Obtener cursos basados en carrera y ciclo
            fetchAndDisplayPosts(); // Actualizar los posts al seleccionar ciclo
            
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
                cursoNav.innerHTML = ''; // Limpiar el contenedor de cursos antes de agregar nuevos cursos

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

                // Añadir event listeners a las nuevas opciones de curso
                document.querySelectorAll('.curso-option').forEach(option => {
                    option.addEventListener('click', function(event) {
                        event.preventDefault();
                        const cursoName = this.querySelector('span').textContent;
                        document.getElementById('curso-btn').querySelector('span').textContent = cursoName;
                        selectedCurso = this.getAttribute('data-value');
                        console.log('Curso seleccionado:', selectedCurso);
                
                        document.querySelector('#forms-nav').classList.remove('show'); // Cerrar dropdown
                        fetchAndDisplayPosts(); // Actualizar los posts al seleccionar curso
                        
                        document.querySelector('#forms-nav').classList.remove('show'); // Cerrar el dropdown de 
                        closeDropdown(cursoBtn);
                    });
                });
                                   
                
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
                // Mostrar mensaje de error al usuario
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
        carreraBtn.querySelector('span').textContent = defaultCarreraText;
        cicloBtn.querySelector('span').textContent = defaultCicloText;
        cursoBtn.querySelector('span').textContent = defaultCursoText;

        cicloBtn.classList.add('disabled');
        cursoBtn.classList.add('disabled');

        selectedCarrera = null;
        selectedCiclo = null;
        selectedCurso = null;

        fetchAndDisplayAllPosts(); // Actualizar los posts al limpiar la selección

        closeDropdown(carreraBtn);
        closeDropdown(cicloBtn);
        closeDropdown(cursoBtn);
    });

    // Función para cerrar el dropdown después de una selección
    function closeDropdown(button)
{
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
        postContainer.innerHTML = ''; // Limpiar el contenedor de posts antes de agregar nuevos posts

        if (!Array.isArray(posts)) {
            throw new Error('La respuesta no es un array');
        }

        posts.forEach(item => {
            const post = item.post;
            const carrera = item.carrera;
            const curso = item.curso;

            const newPost = document.createElement('div');
            newPost.classList.add('activity-item', 'd-flex', 'flex-column', 'p-2', 'mb-2', 'border');

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

            const tagsContainer = newPost.querySelector('.post-tags');
            tagsContainer.innerHTML = ''; // Limpiar las etiquetas anteriores

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

            postContainer.appendChild(newPost);
        });
    }
});
