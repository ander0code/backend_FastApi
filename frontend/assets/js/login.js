document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    const alert = document.getElementById('custom-alert');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new URLSearchParams();
        formData.append('email', form.email.value);
        formData.append('password', form.password.value);

        try {
            const response = await fetch('/autenticacion/login', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Si la respuesta indica que las credenciales son correctas, redirigir al dashboard
                const tokenHeader = response.headers.get('Set-Cookie');
                const token = tokenHeader;

                // Almacenar el token en localStorage
                localStorage.setItem('token', token);

                window.location.href = "/autenticacion/dashboard";
            } else {
                // Si la respuesta indica que las credenciales son incorrectas, mostrar mensaje de error
                const responseData = await response.json();
                throw new Error(responseData.detail);
            }
        } catch (error) {
            // Mostrar mensaje de error en caso de problemas de conexión o errores en el servidor
            showAlert(error.message);
        }
    });

    function showAlert(message) {
        alert.classList.remove('d-none');
        alert.textContent = message;
    }
});
