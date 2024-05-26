document.addEventListener('DOMContentLoaded', () => {
    let selectedCarrera = null;
    let selectedCiclo = null;

    document.querySelectorAll('.carrera-option').forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCarrera = this.getAttribute('data-value');
            selectedCiclo = null;  // Reset ciclo when a new carrera is selected
            document.getElementById('curso-btn').classList.add('disabled');
<<<<<<< HEAD
            document.querySelector('#ciclo-btn span').textContent = "Ciclo"; // Reset ciclo button text
            document.querySelector('#curso-btn span').textContent = "Curso"; // Reset curso button text
            document.querySelector('#forms-nav').classList.remove('show'); // Close curso dropdown
=======
>>>>>>> 812247f153105f25da24f4fc93e63ef813b0f627
            updateCicloButton();
        });
    });

    document.querySelectorAll('.ciclo-option').forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCiclo = this.getAttribute('data-value');
<<<<<<< HEAD
            document.querySelector('#ciclo-btn span').textContent = this.querySelector('span').textContent;
            document.querySelector('#curso-btn span').textContent = "Curso"; // Reset curso button text
            document.getElementById('curso-btn').classList.add('disabled'); // Disable curso button
=======
>>>>>>> 812247f153105f25da24f4fc93e63ef813b0f627
            fetchAndDisplayCursos();
        });
    });

    function updateCicloButton() {
        if (selectedCarrera) {
            document.getElementById('ciclo-btn').classList.remove('disabled');
        }
    }

    function fetchAndDisplayCursos() {
        if (!selectedCarrera || !selectedCiclo) {
            console.error('Debe seleccionar una carrera y un ciclo antes de filtrar.');
            return;
        }

        const url = `http://127.0.0.1:8000/curso/${selectedCarrera}/${selectedCiclo}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los cursos');
                }
                return response.json();
            })
            .then(cursos => {
                const cursoNav = document.getElementById('forms-nav');
                cursoNav.innerHTML = '';  // Limpiar el contenedor de cursos antes de agregar nuevos cursos

                if (!Array.isArray(cursos)) {
                    throw new Error('La respuesta no es un array');
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
<<<<<<< HEAD
                        document.querySelector('#forms-nav').classList.remove('show'); // Close dropdown
=======
>>>>>>> 812247f153105f25da24f4fc93e63ef813b0f627
                        // Aquí puedes agregar lógica para manejar la selección del curso
                    });
                });
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
                // Podrías agregar aquí código para mostrar un mensaje al usuario, etc.
            });
    }
<<<<<<< HEAD
=======

    function fetchAndDisplayPosts() {
        if (!selectedCarrera) {
            console.error('Debe seleccionar una carrera antes de filtrar.');
            return;
        }

        // Construir la URL con los valores seleccionados
        let url = `http://127.0.0.1:8000/posts/${selectedCarrera}`;
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

                // Limpiar el contenedor de posts antes de agregar nuevos posts
                postContainer.innerHTML = '';

                posts.forEach(post => {
                    const newPost = postTemplate.cloneNode(true);
                    newPost.removeAttribute('id'); // Eliminar el ID para evitar duplicados
                    newPost.style.display = ''; // Remover el display none para que sea visible

                    // Asignar los valores a los elementos del post
                    newPost.querySelector('.post-title').textContent = post.titulo || 'Título no disponible';
                    newPost.querySelector('.post-title').href = './text.html'; // Esto debería actualizarse si el link debe variar por post
                    newPost.querySelector('.post-date').textContent = post.fecha_Creacion ? new Date(post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible';
                    newPost.querySelector('.post-author').textContent = post.propietarioNombre || 'Autor no disponible';

                    // Etiquetas
                    const tagsContainer = newPost.querySelector('.post-tags');
                    tagsContainer.innerHTML = ''; // Limpia previos tags
                    (post.etiquetas || []).forEach(tag => {
                        const tagLink = document.createElement('a');
                        tagLink.href = '#';
                        tagLink.className = 'text-black mr-2';
                        tagLink.textContent = tag;
                        tagsContainer.appendChild(tagLink);
                    });

                    // Asignar datos de favoritos, comentarios y visitas
                    newPost.querySelector('.post-votes').textContent = `${post.conteo_favoritos || 0} Favoritos`;
                    newPost.querySelector('.post-replies').textContent = `${post.recuento_comentarios || 0} Comentarios`;
                    newPost.querySelector('.post-views').textContent = `${post.conteo_visitas || 0} Visitas`;

                    postContainer.appendChild(newPost);
                });

                // Eliminar la plantilla original después de usarla
                postTemplate.remove();
            })
            .catch(error => {
                console.error('Error al obtener los posts:', error);
                // Podrías agregar aquí código para mostrar un mensaje al usuario, etc.
            });
    }
>>>>>>> 812247f153105f25da24f4fc93e63ef813b0f627
});
