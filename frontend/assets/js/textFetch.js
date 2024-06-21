document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post_id');

    if (postId) {
        fetchPostDetails(postId);
        fetchPostResponses(postId);
        document.querySelector('.question-title').dataset.postId = postId; // Almacenar postId en un atributo de data
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
        })
        .catch(error => {
            console.error('Error al obtener el userID:', error);
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
    const votos = postData.votos.cantidad;

    const profilePicElement = document.querySelector('.profile-pic');
    let userImageURL = './assets/img/defaultft.webp'; // Establecer la imagen por defecto

    if (postData.imgUser && postData.imgUser.foto) {
        userImageURL = postData.imgUser.foto; // Usar la URL de la imagen del usuario si está disponible
    }

    profilePicElement.src = userImageURL;

    document.querySelector('.question-title').textContent = post.titulo || 'Título no disponible';
    document.querySelector('.question-details').textContent = post.descripcion || 'No hay descripción';

    // Crear el enlace para el nombre del autor
    let autorNombre = post.propietarioNombre || 'Autor no disponible';
    let autorURL = post.propietarioURL || '/autenticacion/perfils';
    let enlaceAutor = `<a href="${autorURL}" class="goPerfil">${autorNombre}</a>`;

    // Actualizar el contenido del contenedor .question-meta con el nombre del autor enlazado y la fecha
    document.querySelector('.question-meta').innerHTML = `${enlaceAutor} | ${post.fecha_Creacion || 'Fecha no disponible'}`;

    const voteCountElement = document.querySelector('.vote-count');
    voteCountElement.textContent = votos;

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

    document.querySelector('.upvote').addEventListener('click', function() {
        handleVote(voteCountElement, this, document.querySelector('.downvote'));
    });

    document.querySelector('.downvote').addEventListener('click', function() {
        handleVote(voteCountElement, this, document.querySelector('.upvote'));
    });
}

function displayPostResponses(responseData) {
    const commentsContainer = document.querySelector('.comments');
    commentsContainer.innerHTML = '';

    responseData.forEach(response => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';

        const voteButtons = document.createElement('div');
        voteButtons.className = 'votes';
        voteButtons.innerHTML = `
            <button class="vote-button upvote" data-response-id="${response.comentario_id}"><img class="buttonImgPosiComment" src="./assets/img/votoPosi.png"></img></button>
            <p class="vote-count" id="vote-count">${response.puntuacion}</p>
            <button class="vote-button downvote" data-response-id="${response.comentario_id}"><img class="buttonImgNegaComment" src="./assets/img/votoNega.png"></img></button>
        `;

        const commentInfo = document.createElement('div');
        commentInfo.className = 'comment-info';
        commentInfo.innerHTML = `
            <p class="comment-meta"><a href="/autenticacion/perfils" class="goPerfil">${response.UserData.nombre} ${response.UserData.last_Name}</a> | ${response.fecha_creacion}</p>
            <p class="comment-text">${response.texto}</p>
        `;

        commentElement.appendChild(voteButtons);
        commentElement.appendChild(commentInfo);
        commentsContainer.appendChild(commentElement);

        commentElement.querySelector('.upvote').addEventListener('click', function() {
            handleVote(commentElement.querySelector('.vote-count'), this, commentElement.querySelector('.downvote'));
        });
        
        commentElement.querySelector('.downvote').addEventListener('click', function() {
            handleVote(commentElement.querySelector('.vote-count'), this, commentElement.querySelector('.upvote'));
        });
    });
}

function displayAllPostResponses(responseData) {
    const commentsContainer = document.querySelector('.comments');
    commentsContainer.innerHTML = '';

    responseData.forEach(response => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';

        const voteButtons = document.createElement('div');
        voteButtons.className = 'votes';
        voteButtons.innerHTML = `
            <button class="vote-button upvote" data-response-id="${response.comentario_id}"><img class="buttonImgPosiComment" src="./assets/img/votoPosi.png"></img></button>
            <p class="vote-count" id="vote-count">${response.puntuacion}</p>
            <button class="vote-button downvote" data-response-id="${response.comentario_id}"><img class="buttonImgNegaComment" src="./assets/img/votoNega.png"></img></button>
        `;

        const commentInfo = document.createElement('div');
        commentInfo.className = 'comment-info';
        commentInfo.innerHTML = `
            <p class="comment-meta"><a href="/autenticacion/perfils" class="goPerfil">${response.UserData.nombre} ${response.UserData.last_Name}</a> | ${response.fecha_creacion}</p>
            <p class="comment-text">${response.texto}</p>
        `;

        commentElement.appendChild(voteButtons);
        commentElement.appendChild(commentInfo);
        commentsContainer.appendChild(commentElement);

        commentElement.querySelector('.upvote').addEventListener('click', function() {
            handleVote(commentElement.querySelector('.vote-count'), this, commentElement.querySelector('.downvote'));
        });
        
        commentElement.querySelector('.downvote').addEventListener('click', function() {
            handleVote(commentElement.querySelector('.vote-count'), this, commentElement.querySelector('.upvote'));
        });
    });
}


function handleVote(voteCountElement, clickedButton, otherButton, puntuacion) {
    const voteCount = parseInt(voteCountElement.textContent);
    const postId = document.querySelector('.question-title').dataset.postId; // Obtener postId del atributo data
    const userEmail = localStorage.getItem('email');

    if (!userEmail) {
        console.error('No se encontró el correo del usuario logueado');
        alert('Debes estar logueado para votar');
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

        const tipo_voto = clickedButton.classList.contains('upvote') ? 'POST' : 'NEG';
        const tipo_objeto = 'POST';

        const voteData = {
            tipo_voto: tipo_voto,
            tipo_objeto: tipo_objeto
        };

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
                throw new Error('Error en la respuesta del servidor al votar');
            }
            return response.json();
        })
        .then(data => {
            console.log('Voto registrado:', data);
            if (clickedButton.classList.contains('upvote')) {
                if (otherButton.classList.contains('downvoted')) {
                    otherButton.classList.remove('downvoted');
                }
                clickedButton.classList.add('upvoted');
            } else {
                if (otherButton.classList.contains('upvoted')) {
                    otherButton.classList.remove('upvoted');
                }
                clickedButton.classList.add('downvoted');
            }

            // Verificar si se encuentra el elemento de conteo de votos
            if (voteCountElement) {
                voteCountElement.textContent = puntuacion;
            } else {
                console.error('Elemento de conteo de votos no encontrado');
            }

            // Recargar la página después de votar
            window.location.reload();
        })
        .catch(error => {
            console.error('Error al registrar el voto:', error);
            alert('Hubo un problema al registrar el voto');
        });
    })
    .catch(error => {
        console.error('Error al obtener el userID:', error);
    });
}