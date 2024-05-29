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
    const url = `http://127.0.0.1:8000/posts/${postId}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener el post');
            }
            return response.json();
        })
        .then(post => {
            displayPostDetails(post);
        })
        .catch(error => {
            console.error('Error al cargar el post:', error);
        });
}

function displayPostDetails(postData) {
    const post = postData.post;
    document.getElementById('post-title').textContent = post.titulo;
    document.getElementById('author-name').textContent = post.propietarioNombre;
    document.getElementById('creation-date').textContent = new Date(post.fecha_Creacion).toLocaleDateString();
    document.getElementById('post-content').textContent = post.descripcion;

    // Puedes agregar más detalles del post aquí si es necesario
}
