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
            topFivePosts.forEach(post => {
                const newPopularPost = popularPostTemplate.cloneNode(true);
                newPopularPost.style.display = 'flex';
                newPopularPost.querySelector('.activite-label').textContent = new Date(post.post.fecha_Creacion).toLocaleDateString();
                newPopularPost.querySelector('.post-title').textContent = post.post.titulo;
                newPopularPost.querySelector('.post-author').textContent = post.post.propietarioNombre;

                // Agregar etiquetas de carrera, ciclo y curso si están disponibles
                const tagsContainer = newPopularPost.querySelector('.post-tags');
                tagsContainer.innerHTML = ''; // Limpiar etiquetas anteriores
                let hasTags = false;

                if (post.carrera && post.carrera.etiquetaNombre) {
                    const carreraTag = document.createElement('span');
                    carreraTag.className = 'badge bg-primary text-light';
                    carreraTag.textContent = post.carrera.etiquetaNombre;
                    tagsContainer.appendChild(carreraTag);
                    hasTags = true;
                }
                if (post.curso && post.curso.ciclo !== null) {
                    const cicloTag = document.createElement('span');
                    cicloTag.className = 'badge bg-warning text-dark';
                    cicloTag.textContent = `Ciclo ${post.curso.ciclo}`;
                    tagsContainer.appendChild(cicloTag);
                    hasTags = true;
                }
                if (post.curso && post.curso.nombre_curso) {
                    const cursoTag = document.createElement('span');
                    cursoTag.className = 'badge bg-secondary text-light';
                    cursoTag.textContent = post.curso.nombre_curso;
                    tagsContainer.appendChild(cursoTag);
                    hasTags = true;
                }

                if (!hasTags) {
                    const generalTag = document.createElement('span');
                    generalTag.className = 'badge bg-success text-light';
                    generalTag.textContent = 'General';
                    tagsContainer.appendChild(generalTag);
                }

                popularPostsContainer.appendChild(newPopularPost);
            });
        })
        .catch(error => console.error('Error:', error));
});
