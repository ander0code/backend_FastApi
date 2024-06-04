document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post_id');

    if (postId) {
        fetchPostDetails(postId);
        fetchPostResponses(postId);
    } else {
        console.error('No se proporcionó un ID de post en la URL');
    }

    const commentForm = document.querySelector('#formulario');
    const commentTextArea = document.querySelector('#editor');
    const addCommentButton = document.querySelector('#add-comment');

    // Habilitar el botón de comentario solo si hay texto en el textarea
    commentTextArea.addEventListener('input', function() {
        addCommentButton.disabled = commentTextArea.value.trim() === '';
    });

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const commentText = commentTextArea.value.trim();

        if (!commentText) {
            return;
        }

        console.log('Intentando enviar comentario...');

        // Obtener el correo del usuario logueado desde el local storage
        const userEmail = localStorage.getItem('email');

        if (!userEmail) {
            console.error('No se encontró el correo del usuario logueado');
            return;
        }

        console.log('Email obtenido:', userEmail);

        // Obtener userID usando el correo
        fetch(`http://127.0.0.1:8000/users_nuevo/${encodeURIComponent(userEmail)}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(userData => {
            if (userData.length === 0) {
                console.error('No se encontró el usuario con el correo proporcionado');
                return;
            }
            const userID = userData[0].id;
            console.log('UserID obtenido:', userID);

            // Publicar el comentario
            const commentData = {
                texto: commentText
            };

            fetch(`http://127.0.0.1:8000/coment/${postId}/${userID}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                console.log('Comentario publicado:', data);
                // Limpiar el textarea después de enviar el comentario
                commentTextArea.value = '';
                addCommentButton.disabled = true;
                // Actualizar la lista de respuestas
                fetchPostResponses(postId);
            })
            .catch(error => {
                console.error('Error al publicar el comentario:', error);
            });
        })
        .catch(error => {
            console.error('Error al obtener el userID:', error);
        });
    });
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
    const votos = postData.votos.cantidad;

    document.querySelector('.question-title').textContent = post.titulo || 'Título no disponible';
    document.querySelector('.question-details').textContent = post.descripcion || 'No hay descripción';
    document.querySelector('.post-owner').textContent = post.propietarioNombre || 'Autor no disponible';
    document.querySelector('.post-date').textContent = post.fecha_Creacion ? new Date(post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible';

    const voteCountElement = document.querySelector('.vote-count');
    voteCountElement.textContent = votos;

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

    // Add event listeners for upvote and downvote buttons
    document.querySelector('.upvote').addEventListener('click', function() {
        handleVote(voteCountElement, this, document.querySelector('.downvote'));
    });

    document.querySelector('.downvote').addEventListener('click', function() {
        handleVote(voteCountElement, this, document.querySelector('.upvote'));
    });
}

function displayPostResponses(responseData) {
    const answersContainer = document.querySelector('.answers');
    answersContainer.innerHTML = ''; // Clear existing answers

    responseData.forEach(response => {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer';

        const voteButtons = document.createElement('div');
        voteButtons.className = 'vote-buttons';
        voteButtons.innerHTML = `
            <button class="upvote" data-response-id="${response.comentario_id}">&uarr;</button>
            <div class="vote-count">${response.puntuacion}</div>
            <button class="downvote" data-response-id="${response.comentario_id}">&darr;</button>
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

        // Add event listeners for upvote and downvote buttons for responses
        answerElement.querySelector('.upvote').addEventListener('click', function() {
            handleVote(this.nextElementSibling, this, answerElement.querySelector('.downvote'));
        });

        answerElement.querySelector('.downvote').addEventListener('click', function() {
            handleVote(this.previousElementSibling, this, answerElement.querySelector('.upvote'));
        });
    });
}

function handleVote(voteCountElement, clickedButton, otherButton) {
    let voteCount = parseInt(voteCountElement.textContent);

    if (clickedButton.classList.contains('upvote')) {
        voteCount++;
    } else {
        voteCount--;
    }

    voteCountElement.textContent = voteCount;
    clickedButton.disabled = true;
    otherButton.disabled = false;
}
