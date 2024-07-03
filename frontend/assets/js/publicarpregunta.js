document.addEventListener('DOMContentLoaded', function() {
    let userId = null;

    // Función para obtener el valor de una cookie por su nombre
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const token = getCookie('access_token');

    if (!token) {
        console.error('No se encontró el token en las cookies');
        return;
    }

    // Decodificar el payload del token JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);

    const email = payload.email; // Obtener el email del payload del token

    fetch(`http://127.0.0.1:8000/users_nuevo/${encodeURIComponent(email)}`, {
        headers: {
            'Authorization': `Bearer ${token}` // Incluir el token en el encabezado de la solicitud
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener el perfil del usuario');
        }
        return response.json();
    })
    .then(user => {
        console.log('Datos del usuario recibidos:', user); // Verificar los datos recibidos
        userId = user[0].codigo_ID; // Extraer el codigo_ID del usuario
        console.log('Usuario ID:', userId); // Verificar el ID del usuario

        const profileName = document.getElementById('profile-name');
        const profileFullname = document.getElementById('profile-fullname');
        const profileCarrer = document.getElementById('profile-carreer');
        const profileImg = document.getElementById('profile-img');

        if (profileName && profileFullname && profileCarrer && profileImg) {
            const nombre = user[0].nombre || 'N/A';
            const lastName = user[0].last_Name || 'N/A';
            const carreer = user[0].carrera.etiquetaNombre || 'N/A';
            const fotex = user[0].usuariofoto || './assets/img/defaultft.jpg';

            console.log(`Nombre: ${nombre}, Apellido: ${lastName}, Carrera: ${carreer}, Foto: ${fotex}`); // Verificar valores

            profileName.textContent = `${nombre} ${lastName}`;
            profileFullname.textContent = `${nombre} ${lastName}`;
            profileCarrer.textContent = `Carrera: ${carreer}`;
            profileImg.src = fotex;
        } else {
            throw new Error('No se encontraron los elementos para reemplazar los datos del perfil');
        }
    })
    .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
    });

    // Función para mostrar la alerta de éxito
    function showSuccessAlert(message, postId) {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: message,
            showConfirmButton: false,
            timer: 1000
        }).then(() => {
            window.location.href = `http://127.0.0.1:8000/autenticacion/texto?post_id=${postId}`;
        });
    }

    // Función para publicar la pregunta
    const form = document.getElementById('publicarPreguntaForm');
    const botonPublicar = document.querySelector('.botonPublicar');
    const tipoPreguntaInputs = document.querySelectorAll('input[name="tipoPregunta"]');
    const academicaFields = document.getElementById('academicaFields');
    const carreraSelect = document.getElementById('carrera');
    const cicloSelect = document.getElementById('ciclo');
    const cursoSelect = document.getElementById('curso');

    tipoPreguntaInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            if (event.target.value === 'academica') {
                academicaFields.style.display = 'block';
                carreraSelect.disabled = false;
                cicloSelect.disabled = false;
                cursoSelect.disabled = false;
            } else {
                academicaFields.style.display = 'none';
                carreraSelect.disabled = true;
                cicloSelect.disabled = true;
                cursoSelect.disabled = true;
            }
        });
    });

    const togglePublishButton = () => {
        const titulo = document.getElementById('titulo');
        const contenido = document.getElementById('contenido');
        const tipoPregunta = document.querySelector('input[name="tipoPregunta"]:checked');

        if (!titulo || !contenido || !tipoPregunta) {
            return; // Salir si algún elemento no está disponible
        }

        let canPublish = titulo.value.trim() !== '' && contenido.value.trim() !== '';

        if (tipoPregunta.value === 'academica') {
            const carreraValue = carreraSelect.value;
            const cicloValue = cicloSelect.value;
            const cursoValue = cursoSelect.value;

            canPublish = canPublish && carreraValue !== '' && cicloValue !== '' && cursoValue !== '';
        }

        botonPublicar.disabled = !canPublish;
    };

    form.addEventListener('input', togglePublishButton);
    tipoPreguntaInputs.forEach(input => input.addEventListener('change', togglePublishButton));

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!userId) {
            console.error('Usuario no encontrado. No se puede publicar la pregunta.');
            return;
        }

        const tipoPregunta = document.querySelector('input[name="tipoPregunta"]:checked').value;
        const titulo = document.getElementById('titulo').value;
        const contenido = document.getElementById('contenido').value;

        let carreraId = null;
        let cursoId = null;

        if (tipoPregunta === 'academica') {
            carreraId = parseInt(carreraSelect.value, 10) || null;
            cursoId = parseInt(cursoSelect.value, 10) || null;
        }

        const formData = {
            title: titulo,
            content: contenido,
            carrera_id: carreraId,
            curso_id: cursoId
        };

        console.log('Datos enviados:', formData); // Log para revisar los datos enviados

        // Deshabilitar el botón de publicar y cambiar el texto a "Publicando..."
        botonPublicar.disabled = true;
        botonPublicar.textContent = 'Publicando...';

        fetch(`http://127.0.0.1:8000/posts/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Respuesta del servidor:', errorData); // Log para revisar la respuesta del servidor
                    throw new Error('No se pudo publicar la pregunta');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data); // Añadir log para revisar la respuesta
            const postId = data.post.id; // Asegúrate de acceder correctamente al ID
            console.log('Post ID:', postId); // Verificar el ID de la nueva pregunta

            // Mostrar la alerta de éxito y redirigir al usuario a la nueva pregunta
            showSuccessAlert('¡Pregunta creada!', postId);
        })
        .catch(error => {
            console.error('Error al publicar la pregunta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al publicar la pregunta',
                showConfirmButton: false,
                timer: 2000
            });

            // Volver a habilitar el botón y restaurar el texto original en caso de error
            botonPublicar.disabled = false;
            botonPublicar.textContent = 'Publicar';
        });
    });
});
