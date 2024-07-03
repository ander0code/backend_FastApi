document.addEventListener("DOMContentLoaded", function () {
    const enviarBtn = document.getElementById("enviarBtn");
    

    // Get logged in user's email from localStorage
    const userEmail = localStorage.getItem("email");

    // Obtener el ID del usuario a partir del correo electrónico
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
            alert('No se encontró el usuario con el correo proporcionado');
            return;
        }
        const userId = userData[0].id;
      

        // Aquí asumimos que tienes el ID del servicio de alguna manera
        const idServicio = 1;

        
        // Event listener for enviarBtn click
        enviarBtn.addEventListener("click", function () {
            // Validate form
            const calificacion = document.querySelector('input[name="calificacion"]:checked');
            const servicio = document.querySelector('input[name="servicio"]:checked');
            const facilidades = document.querySelector('input[name="facilidades"]:checked');
            const orientacion = document.querySelector('input[name="orientacion"]:checked');
            const comentario = document.getElementById("comentario").value.trim();

            if (!calificacion || !servicio || !facilidades || !orientacion || comentario === "") {
                alert("Por favor completa todos los campos requeridos.");
                return;
            }

            // Prepare data for POST request
            const postData = {
                "id_user": userId,
                "id_servicio": idServicio,
                "calificacion_general": parseInt(calificacion.value),
                "calificacion_1": parseInt(servicio.value),
                "calificacion_2": parseInt(facilidades.value),
                "calificacion_3": parseInt(orientacion.value),
                "resena": comentario,
                "fecha_creacion": new Date().toISOString() // Añadir fecha de creación
            };

            // Confirm submission
            if (confirm("¿Estás seguro de enviar esta reseña?")) {
                // Insert calificacion using the provided endpoint
                fetch(`http://127.0.0.1:8000/put_servicios_id`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                })
                .then(response => {
                    if (response.ok) {
                        alert("Reseña enviada exitosamente");
                        // Redirigir a la página deseada o actualizar la interfaz
                    } else {
                        alert("Error al enviar la reseña. Inténtalo de nuevo.");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Error al enviar la reseña. Inténtalo de nuevo.");
                });
            }
        });
    })
    .catch(error => console.error('Error:', error));
});
