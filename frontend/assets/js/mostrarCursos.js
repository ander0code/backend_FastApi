document.addEventListener('DOMContentLoaded', () => {
    let selectedCarrera = null;
    let selectedCiclo = null;

    document.querySelectorAll('.carrera-option').forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCarrera = this.getAttribute('data-value');
            selectedCiclo = null; // Reset ciclo when a new carrera is selected
            document.getElementById('curso-btn').classList.add('disabled');
            document.querySelector('#ciclo-btn span').textContent = "Ciclo"; // Reset ciclo button text
            document.querySelector('#curso-btn span').textContent = "Curso"; // Reset curso button text
            document.querySelector('#forms-nav').classList.remove('show'); // Close curso dropdown

            updateCicloButton();
        });
    });

    document.querySelectorAll('.ciclo-option').forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCiclo = this.getAttribute('data-value');

            document.querySelector('#ciclo-btn span').textContent = this.querySelector('span').textContent;
            document.querySelector('#curso-btn span').textContent = "Curso"; // Reset curso button text
            document.getElementById('curso-btn').classList.add('disabled'); // Disable curso button

            fetchAndDisplayCursos();
        });
    });

    function updateCicloButton() {
        if (selectedCarrera) {
            document.getElementById('ciclo-btn').classList.remove('disabled');
        } else {
            document.getElementById('ciclo-btn').classList.add('disabled');
        }
    }

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
                        const cursoValue = this.getAttribute('data-value');
                        console.log('Curso seleccionado:', cursoValue);

                        document.querySelector('#forms-nav').classList.remove('show'); // Close dropdown
                        // Aquí puedes agregar lógica para manejar la selección del curso
                    });
                });
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
                // Podrías agregar aquí código para mostrar un mensaje al usuario, etc.
            });
    }

    function fetchAndDisplayPosts() {
        if (!selectedCarrera) {
            console.error('Debe seleccionar una carrera antes de filtrar.');
            return;
        }

        let url = `http://127.0.0.1:8000/posts_nuevo/${selectedCarrera}`;
        if (selectedCiclo) {
            url = `http://127.0.0.1:8000/curso/${selectedCarrera}/${selectedCiclo}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los posts');
                }
                return response.json();
            })
            .then(posts => {
                const postContainer = document.getElementById('post-container');
                const postTemplate = document.getElementById('post-template');

                if (!Array.isArray(posts)) {
                    throw new Error('La respuesta no es un array');
                }

                postContainer.innerHTML = ''; // Limpiar el contenedor de posts antes de agregar nuevos posts

                posts.forEach(post => {
                    const newPost = postTemplate.cloneNode(true);
                    newPost.removeAttribute('id'); // Eliminar el ID para evitar duplicados
                    newPost.style.display = ''; // Remover el display none para que sea visible

                    newPost.querySelector('.post-title').textContent = post.post.titulo || 'Título no disponible';
                    newPost.querySelector('.post-title').href = './text.html'; // Esto debería actualizarse si el link debe variar por post
                    newPost.querySelector('.post-date').textContent = post.post.fecha_Creacion ? new Date(post.post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible';
                    newPost.querySelector('.post-author').textContent = post.post.propietarioNombre || 'Autor no disponible';

                    const tagsContainer = newPost.querySelector('.post-tags');
                    tagsContainer.innerHTML = ''; // Limpia previos tags
                    const tags = [];

                    if (post.carrera && post.carrera.etiquetaNombre) {
                        tags.push(post.carrera.etiquetaNombre);
                    }

                    if (post.curso && post.curso.nombre_curso) {
                        tags.push(post.curso.nombre_curso);
                    }

                    tags.forEach(tag => {
                        const tagLink = document.createElement('a');
                        tagLink.href = '#';
                        tagLink.className = 'text-black mr-2';
                        tagLink.textContent = tag;
                        tagsContainer.appendChild(tagLink);
                    });

                    newPost.querySelector('.post-votes').textContent = `${post.post.conteo_favoritos || 0} Favoritos`;
                    newPost.querySelector('.post-replies').textContent = `${post.post.recuento_comentarios || 0} Comentarios`;
                    newPost.querySelector('.post-views').textContent = `${post.post.conteo_visitas || 0} Visitas`;

                    postContainer.appendChild(newPost);
                });

                postTemplate.remove();
            })
            .catch(error => {
                console.error('Error al obtener los posts:', error);
                // Podrías agregar aquí código para mostrar un mensaje al usuario, etc.
            });
    }
});
