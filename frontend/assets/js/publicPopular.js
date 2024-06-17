document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8000/posts_nuevo/')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener los posts');
            }
            return response.json();
        })
        .then(posts => {
            const popularPostTemplate = document.getElementById('popular-post-template');
            const popularPostsContainer = document.getElementById('popular-posts');

            // Ordenar las publicaciones por popularidad (suma de conteo de favoritos y visitas)
            posts.sort((a, b) => (b.post.conteo_favoritos + b.post.conteo_visitas) - (a.post.conteo_favoritos + a.post.conteo_visitas));

            // Tomar las cinco publicaciones más populares
            const topFivePosts = posts.slice(0, 5);

            // Limpiar el contenedor antes de añadir nuevas publicaciones
            popularPostsContainer.innerHTML = '';

            // Crear y añadir las cinco publicaciones más populares
            topFivePosts.forEach(item => {
                const post = item.post;
                const carrera = item.carrera;
                const curso = item.curso;

                const newPopularPost = popularPostTemplate.cloneNode(true);
                newPopularPost.style.display = 'flex';
                newPopularPost.id = '';

                newPopularPost.querySelector('.activite-label').textContent = `${post.fecha_Creacion}`;
                newPopularPost.querySelector('.post-title').textContent = post.titulo;
                newPopularPost.querySelector('.post-title').href = `/autenticacion/texto?post_id=${post.id}`;
                newPopularPost.querySelector('.post-author').textContent = post.propietarioNombre;

                // Agregar etiquetas de carrera, ciclo y curso si están disponibles
                const tagsContainer = newPopularPost.querySelector('.post-tags');
                tagsContainer.innerHTML = ''; // Limpiar etiquetas anteriores
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
                
                const postTitleLink = newPopularPost.querySelector('.post-title');

                postTitleLink.addEventListener('click', (event) => {
                    if (postTitleLink.classList.contains('disabled')) {
                        event.preventDefault(); // Evitar la redirección predeterminada solo si el enlace está deshabilitado
                    } else {
                        postTitleLink.classList.add('disabled');
                        setTimeout(() => {
                            postTitleLink.classList.remove('disabled');
                        }, 2000); // 3 segundos
                    }
                });

                popularPostsContainer.appendChild(newPopularPost);
            });
        })
        .catch(error => console.error('Error:', error));
});
