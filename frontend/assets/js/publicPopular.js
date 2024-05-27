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
            posts.sort((a, b) => (b.conteo_favoritos + b.conteo_visitas) - (a.conteo_favoritos + a.conteo_visitas));

            // Tomar las cinco publicaciones más populares
            const topFivePosts = posts.slice(0, 3);

            // Limpiar el contenedor antes de añadir nuevas publicaciones
            popularPostsContainer.innerHTML = '';

            // Crear y añadir las cinco publicaciones más populares
            topFivePosts.forEach(post => {
                const newPopularPost = popularPostTemplate.cloneNode(true);
                newPopularPost.style.display = 'flex';
                newPopularPost.querySelector('.activite-label').textContent = new Date(post.fecha_Creacion).toLocaleDateString();
                newPopularPost.querySelector('.post-title').textContent = post.titulo;
                newPopularPost.querySelector('.post-author').textContent = post.propietarioNombre;

                popularPostsContainer.appendChild(newPopularPost);
            });
        })
        .catch(error => console.error('Error:', error));
});
