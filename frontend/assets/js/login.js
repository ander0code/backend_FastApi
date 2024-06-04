document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    const alert = document.getElementById('custom-alert');
    const successAlert = document.getElementById('custom-alerta');
    const submitButton = document.querySelector('.container-button');

    if (form && submitButton) {
        function resetForm() {
            form.reset();
            submitButton.disabled = false;
            submitButton.innerHTML = "<span>Ingresar</span>";
        }

        // Restablecer el formulario al cargar la página
        resetForm();

        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Deshabilitar el botón de enviar
            submitButton.disabled = true;
            submitButton.innerHTML = "Iniciando...";

            const formData = new URLSearchParams();
            formData.append('email', form.email.value);
            formData.append('password', form.password.value);

            try {
                const response = await fetch('/autenticacion/login', {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin' // Asegura que las cookies se incluyan en la solicitud
                });

                if (response.ok) {
                    showSuccessAlert("¡Se ingresó correctamente!");
                    // Esperar 1 segundo antes de redirigir al dashboard
                    setTimeout(() => {
                        window.location.href = "/autenticacion/dashboard";
                    }, 1000);
                } else {
                    const responseData = await response.json();
                    throw new Error(responseData.detail);
                }
            } catch (error) {
                showAlert(error.message);
                // Habilitar el botón nuevamente si ocurre un error
                resetForm();
            }
        });

        function showAlert(message) {
            alert.classList.remove('d-none');
            alert.textContent = message;
            setTimeout(() => {
                alert.classList.add('d-none');
            }, 2000); // Ocultar la alerta después de 2 segundos
        }

        function showSuccessAlert(message) {
            successAlert.classList.remove('d-none');
            successAlert.textContent = message;
            setTimeout(() => {
                successAlert.classList.add('d-none');
            }, 2000); // Ocultar la alerta de éxito después de 1 segundo
        }

        // Usar el evento pageshow para restablecer el formulario al navegar hacia atrás
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                resetForm();
            }
        });
    } else {
        console.error('Formulario o botón de envío no encontrado');
    }
});
