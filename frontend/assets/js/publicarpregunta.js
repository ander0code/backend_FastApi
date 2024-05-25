document.addEventListener('DOMContentLoaded', () => {
    // Función para enviar datos del formulario a la API
    const form = document.getElementById('publicarPreguntaForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {
            titulo: document.getElementById('titulo').value,
            contenido: document.getElementById('contenido').value,
            propietarioNombre: document.getElementById('propietarioNombre').value
        };

        fetch('http://127.0.0.1:8000/Post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo publicar la pregunta');
            }
            return response.json();
        })
        .then(data => {
            alert('Pregunta publicada exitosamente');
            form.reset();  // Limpiar el formulario después de enviar
            fetchPopularPosts();  // Actualizar publicaciones populares
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al publicar la pregunta');
        });
    });

    // Función para obtener y mostrar las publicaciones populares
    const fetchPopularPosts = () => {
        fetch('http://127.0.0.1:8000/Post/')
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

                // Tomar las tres publicaciones más populares
                const topThreePosts = posts.slice(0, 3);

                // Limpiar el contenedor antes de añadir nuevas publicaciones
                popularPostsContainer.innerHTML = '';

                // Crear y añadir las tres publicaciones más populares
                topThreePosts.forEach(post => {
                    const newPopularPost = popularPostTemplate.content.cloneNode(true);
                    newPopularPost.querySelector('.activite-label').textContent = new Date(post.fecha_Creacion).toLocaleDateString();
                    newPopularPost.querySelector('.post-title').textContent = post.titulo;
                    newPopularPost.querySelector('.post-author').textContent = post.propietarioNombre;

                    popularPostsContainer.appendChild(newPopularPost);
                });
            })
            .catch(error => console.error('Error:', error));
    };

    // Obtener y mostrar las publicaciones populares al cargar la página
    fetchPopularPosts();
});
