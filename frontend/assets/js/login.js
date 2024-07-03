document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                showConfirmButton: false,
                timer: 2000
            });
        }

        function showSuccessAlert(message) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: message,
                showConfirmButton: false,
                timer: 2000
            });
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
