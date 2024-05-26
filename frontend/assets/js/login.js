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
                body: formData,
                credentials: 'same-origin' // Asegura que las cookies se incluyan en la solicitud
            });

            if (response.ok) {
                // Redirigir al dashboard
                window.location.href = "/autenticacion/dashboard";
            } else {
                const responseData = await response.json();
                throw new Error(responseData.detail);
            }
        } catch (error) {
            showAlert(error.message);
        }
    });

    function showAlert(message) {
        alert.classList.remove('d-none');
        alert.textContent = message;
    }
});
