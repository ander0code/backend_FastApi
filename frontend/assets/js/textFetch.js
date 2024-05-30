document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post_id');

    if (postId) {
        fetchPostDetails(postId);
        fetchPostResponses(postId);
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

function fetchPostResponses(postId) {
    const url = `http://127.0.0.1:8000/comentario_x_idPost/${postId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener las respuestas');
            }
            return response.json();
        })
        .then(responseData => {
            if (Array.isArray(responseData) && responseData.length > 0) {
                displayPostResponses(responseData);
            } else {
                console.error('No se encontraron respuestas para el post con el ID proporcionado');
            }
        })
        .catch(error => {
            console.error('Error al cargar las respuestas:', error);
        });
}

function displayPostDetails(postData) {
    const post = postData.post;

    document.querySelector('.question-title').textContent = post.titulo || 'Título no disponible';
    document.querySelector('.question-details').textContent = post.descripcion || 'Descripción no disponible';
    document.querySelector('.post-owner').textContent = post.propietarioNombre || 'Autor no disponible';
    document.querySelector('.post-date').textContent = post.fecha_Creacion ? new Date(post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible';
    
    const tagsContainer = document.querySelector('.tags');
    tagsContainer.innerHTML = '';

    let tagsExist = false;

    if (postData.carrera) {
        const carreraTag = document.createElement('span');
        carreraTag.textContent = postData.carrera.etiquetaNombre;
        tagsContainer.appendChild(carreraTag);
        tagsExist = true;
    }

    if (postData.curso) {
        const cursoTag = document.createElement('span');
        cursoTag.textContent = postData.curso.nombre_curso;
        tagsContainer.appendChild(cursoTag);
        tagsExist = true;
    }

    if (!tagsExist) {
        const generalTag = document.createElement('span');
        generalTag.textContent = 'General';
        tagsContainer.appendChild(generalTag);
    }
}

function displayPostResponses(responseData) {
    const answersContainer = document.querySelector('.answers');

    responseData.forEach(response => {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer';

        const voteButtons = document.createElement('div');
        voteButtons.className = 'vote-buttons';
        voteButtons.innerHTML = `
            <button class="upvote">&uarr;</button>
            <div class="vote-count">${response.puntuacion}</div>
            <button class="downvote">&darr;</button>
        `;

        const answerContent = document.createElement('div');
        answerContent.className = 'answer-content';
        answerContent.innerHTML = `
            <div class="answer-text">${response.texto}</div>
            <div class="post-meta">
                <span class="post-owner">${response.UserData.nombre} ${response.UserData.last_Name}</span> |
                <span class="post-date">${new Date(response.fecha_creacion).toLocaleDateString()}</span>
            </div>
        `;

        answerElement.appendChild(voteButtons);
        answerElement.appendChild(answerContent);

        answersContainer.appendChild(answerElement);
    });

    // Agregar eventos de votación
    document.querySelectorAll('.vote-buttons button').forEach(button => {
        button.addEventListener('click', function() {
            const voteCountElement = this.parentElement.querySelector('.vote-count');
            let voteCount = parseInt(voteCountElement.textContent);
            if (this.textContent === '↑') {
                voteCount++;
            } else {
                voteCount--;
            }
            voteCountElement.textContent = voteCount;
        });
    });
}

