document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post_id');

    if (postId) {
        fetchPostDetails(postId);
    } else {
        console.error('No se proporcionó un ID de post en la URL');
    }
});

function fetchPostDetails(postId) {
    const url = `http://127.0.0.1:8000/posts_x_postid/${postId}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el post');
            }
            return response.json();
        })
        .then(postData => {
            if (Array.isArray(postData) && postData.length > 0) {
                displayPostDetails(postData[0]);
            } else {
                console.error('No se encontró el post con el ID proporcionado');
            }
        })
        .catch(error => {
            console.error('Error al cargar el post:', error);
        });
}

function displayPostDetails(postData) {
    const post = postData.post;

    document.getElementById('post-title').textContent = post.titulo || 'Título no disponible';
    document.getElementById('author-name').textContent = post.propietarioNombre || 'Autor no disponible';
    document.getElementById('creation-date').textContent = post.fecha_Creacion ? new Date(post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible';
    document.getElementById('post-content').textContent = post.descripcion || 'Descripción no disponible';
    
    document.getElementById('post-views').textContent = `Visitas: ${post.conteo_visitas}`;
    document.getElementById('post-votes').textContent = `Votos: ${post.conteo_favoritos}`;
    document.getElementById('post-comments').textContent = `Comentarios: ${post.recuento_comentarios}`;
    document.getElementById('post-responses').textContent = `Respuestas: ${post.conteo_respuestas}`;
    
    const tagsContainer = document.getElementById('post-tags');
    tagsContainer.innerHTML = '';

    if (postData.carrera) {
        const carreraTag = document.createElement('li');
        carreraTag.className = 'tag';
        carreraTag.textContent = postData.carrera.etiquetaNombre;
        tagsContainer.appendChild(carreraTag);
    }

    if (postData.curso) {
        const cursoTag = document.createElement('li');
        cursoTag.className = 'tag';
        cursoTag.textContent = postData.curso.nombre_curso;
        tagsContainer.appendChild(cursoTag);
    }

    // Agregar votos me gusta y no me gusta
    if (postData.votos) {
        const likesTag = document.createElement('li');
        likesTag.className = 'tag';
        likesTag.textContent = `Me gusta: ${postData.votos.me_gusta}`;
        tagsContainer.appendChild(likesTag);

        const dislikesTag = document.createElement('li');
        dislikesTag.className = 'tag';
        dislikesTag.textContent = `No me gusta: ${postData.votos.no_me_gusta}`;
        tagsContainer.appendChild(dislikesTag);
    }
}