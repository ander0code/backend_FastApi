document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post_id');

    if (postId) {
        fetchPostDetails(postId);
        fetchPostResponses(postId);
    } else {
        console.error('No se proporcionó un ID de post en la URL');
    }

    const commentForm = document.querySelector('.comment-section');
    const commentTextArea = document.querySelector('.comment-input');
    const addCommentButton = document.querySelector('.comment-submit');
    const alertBox = document.getElementById('custom-alerta');
    const alertBox1 = document.getElementById('custom-alerta1');

    commentTextArea.addEventListener('input', function() {
        addCommentButton.disabled = commentTextArea.value.trim() === '';
    });

    addCommentButton.addEventListener('click', function(event) {
        event.preventDefault();
        const commentText = commentTextArea.value.trim();

        if (!commentText) {
            return;
        }

        console.log('Intentando enviar comentario...');

        const userEmail = localStorage.getItem('email');

        if (!userEmail) {
            console.error('No se encontró el correo del usuario logueado');
            return;
        }

        console.log('Email obtenido:', userEmail);

        const lastCommentTime = localStorage.getItem('lastCommentTime');
        const currentTime = new Date().getTime();
        const fiveMinutes = 1 * 60 * 1000;

        if (lastCommentTime && currentTime - lastCommentTime < fiveMinutes) {
            alertBox1.textContent = 'Por favor esperar 1 minuto para subir otra respuesta';
            alertBox1.classList.remove('d-none');
            setTimeout(() => {
                alertBox1.classList.add('d-none');
            }, 3000);
            return;
        }

        addCommentButton.disabled = true;
        addCommentButton.textContent = 'Subiendo comentario...';

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

            const commentData = {
                texto: commentText
            };

            return fetch(`http://127.0.0.1:8000/coment/${postId}/${userID}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Comentario publicado:', data);
            commentTextArea.value = '';
            addCommentButton.disabled = true;
            localStorage.setItem('lastCommentTime', new Date().getTime());
            alertBox.textContent = '¡Respuesta subida, podrás responder de nuevo en unos minutos!';
            alertBox.classList.remove('d-none');
            setTimeout(() => {
                alertBox.classList.add('d-none');
                addCommentButton.textContent = 'Subir comentario';
            }, 3000);
            fetchPostResponses(postId);
        })
        .catch(error => {
            console.error('Error al publicar el comentario:', error);
            alert('Hubo un problema al subir el comentario');
            addCommentButton.disabled = false;
            addCommentButton.textContent = 'Subir comentario';
        });
    });

    // Evento para ver todos los comentarios
    document.querySelector('.view-all-comments').addEventListener('click', function(event) {
        event.preventDefault();
        fetchPostResponses(postId, true); // Agregamos un parámetro para indicar que queremos ver todos los comentarios
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
            if (postData && postData.length > 0) {
                displayPostDetails(postData[0]);
            } else {
                console.error('No se encontró el post con el ID proporcionado');
            }
        })
        .catch(error => {
            console.error('Error al cargar el post:', error);
        });
}

function fetchPostResponses(postId, showAllComments = false) {
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
                if (showAllComments) {
                    displayAllPostResponses(responseData);
                } else {
                    const limitedResponses = responseData.slice(0, 3); // Tomamos solo las primeras 3 respuestas
                    displayPostResponses(limitedResponses);
                }
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
    const postId = post.id; // Obtener el ID del post
    const votos = postData.votos.cantidad;

    document.querySelector('.profile-pic').src = postData.imgUser?.foto || './assets/img/defaultft.webp';
    document.querySelector('.question-title').textContent = post.titulo || 'Título no disponible';
    document.querySelector('.question-details').textContent = post.descripcion || 'No hay descripción';

    const autorNombre = post.propietarioNombre || 'Autor no disponible';
    const autorURL = post.propietarioURL || '/autenticacion/perfils';
    document.querySelector('.question-meta').innerHTML = `<a href="${autorURL}" class="goPerfil">${autorNombre}</a> | ${post.fecha_Creacion || 'Fecha no disponible'}`;

    const voteCountElement = document.querySelector('.vote-count');
    voteCountElement.textContent = votos;
    voteCountElement.setAttribute('data-current-vote', 0); // Inicialmente 0

    const tagsContainer = document.querySelector('.tagsPost');
    tagsContainer.innerHTML = '';

    if (postData.carrera) {
        const carreraTag = document.createElement('span');
        carreraTag.textContent = postData.carrera.etiquetaNombre;
        carreraTag.className = 'tagPost';
        tagsContainer.appendChild(carreraTag);
    }

    if (postData.curso) {
        const cicloTag = document.createElement('span');
        cicloTag.textContent = `Ciclo ${postData.curso.ciclo}`;
        cicloTag.className = 'tagPost';
        tagsContainer.appendChild(cicloTag);
    }

    if (postData.curso) {
        const cursoTag = document.createElement('span');
        cursoTag.textContent = postData.curso.nombre_curso;
        cursoTag.className = 'tagPost';
        tagsContainer.appendChild(cursoTag);
    }

    const userEmail = localStorage.getItem('email');

    if (!userEmail) {
        console.error('No se encontró el correo del usuario logueado');
        return;
    }

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

        // Asegurarse de que los event listeners no se agreguen más de una vez
        const upvoteButton = document.querySelector('.upvote');
        const downvoteButton = document.querySelector('.downvote');

        // Remover listeners antiguos, si los hay
        upvoteButton.removeEventListener('click', handleUpvote);
        downvoteButton.removeEventListener('click', handleDownvote);

        // Añadir listeners
        upvoteButton.addEventListener('click', handleUpvote);
        downvoteButton.addEventListener('click', handleDownvote);

        function handleUpvote() {
            handleVote('POST', postId, userID, voteCountElement, 'UP');
        }

        function handleDownvote() {
            handleVote('NEG', postId, userID, voteCountElement, 'DOWN');
        }
    })
    .catch(error => {
        console.error('Error al obtener el userID:', error);
    });
}

function handleVote(voteType, postId, userID, voteCountElement, direction) {
    const currentVote = parseInt(voteCountElement.getAttribute('data-current-vote')) || 0;
    let newVoteValue = 0;

    if (direction === 'UP') {
        newVoteValue = currentVote === 1 ? 0 : 1; // Cambiar a 0 si ya está en 1, de lo contrario a 1
    } else if (direction === 'DOWN') {
        newVoteValue = currentVote === -1 ? 0 : -1; // Cambiar a 0 si ya está en -1, de lo contrario a -1
    }

    const voteData = {
        tipo_voto: voteType,
        tipo_objeto: direction
    };

    console.log(`Enviando voto: ${JSON.stringify(voteData)} para el postId: ${postId} y userID: ${userID}`);

    fetch(`http://127.0.0.1:8000/voto/${postId}/${userID}`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Error en la respuesta del servidor: ${JSON.stringify(errorData)}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Voto registrado:', data);
        voteCountElement.setAttribute('data-current-vote', newVoteValue);

        let voteCount = parseInt(voteCountElement.textContent);
        voteCount = voteCount - currentVote + newVoteValue; // Ajustar el contador basado en el nuevo voto
        voteCountElement.textContent = voteCount;
    })
    .catch(error => {
        console.error('Error al registrar el voto:', error);
    });
}

function displayPostResponses(responseData) {
    const responseList = document.querySelector('.responses-list');
    responseList.innerHTML = '';

    responseData.forEach(response => {
        const responseItem = document.createElement('div');
        responseItem.className = 'response-item';
        responseItem.innerHTML = `
            <div class="response-content">
                <p>${response.comentario.texto}</p>
                <span class="response-author">${response.comentario.propietarioNombre}</span>
                <span class="response-date">${response.comentario.fecha_Creacion}</span>
            </div>
        `;
        responseList.appendChild(responseItem);
    });

    // Ocultar el botón de "Ver todas las respuestas" si hay menos de 4 respuestas
    const viewAllCommentsButton = document.querySelector('.view-all-comments');
    viewAllCommentsButton.style.display = responseData.length <= 3 ? 'none' : 'block';
}

function displayAllPostResponses(responseData) {
    const responseList = document.querySelector('.responses-list');
    responseList.innerHTML = '';

    responseData.forEach(response => {
        const responseItem = document.createElement('div');
        responseItem.className = 'response-item';
        responseItem.innerHTML = `
            <div class="response-content">
                <p>${response.comentario.texto}</p>
                <span class="response-author">${response.comentario.propietarioNombre}</span>
                <span class="response-date">${response.comentario.fecha_Creacion}</span>
            </div>
        `;
        responseList.appendChild(responseItem);
    });

    // Ocultar el botón de "Ver todas las respuestas" después de mostrar todas las respuestas
    const viewAllCommentsButton = document.querySelector('.view-all-comments');
    viewAllCommentsButton.style.display = 'none';
}
