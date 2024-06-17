document.addEventListener('DOMContentLoaded', function() {
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

    document.querySelector('.vote-count').textContent = votos;

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
        handleVote('POS', postId, document.querySelector('.vote-count'));
    });

    document.querySelector('.downvote').addEventListener('click', function() {
        handleVote('NEG', postId, document.querySelector('.vote-count'));
    });
}

function handleVote(voteType, postId, voteCountElement) {
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

        const voteData = {
            tipo_voto: voteType,
            tipo_objeto: "POST"
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
            let voteCount = parseInt(voteCountElement.textContent);
            if (voteType === 'POST') {
                voteCount++;
            } else {
                voteCount--;
            }
            voteCountElement.textContent = voteCount;
        })
        .catch(error => {
            console.error('Error al registrar el voto:', error);
        });
    })
    .catch(error => {
        console.error('Error al obtener el userID:', error);
    });
    
}
