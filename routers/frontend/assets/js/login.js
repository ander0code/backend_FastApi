document.addEventListener("DOMContentLoaded", function () {
    // Mostrar ventana emergente
    function showErrorModal() {
        var modal = document.getElementById("error-modal");
        modal.style.display = "block";
    }

    // Cerrar ventana emergente
    document.querySelector(".close-button").addEventListener("click", function() {
        var modal = document.getElementById("error-modal");
        modal.style.display = "none";
    });

    // Cerrar ventana emergente al hacer clic fuera de ella
    window.onclick = function(event) {
        var modal = document.getElementById("error-modal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Validar el formulario y mostrar el mensaje de error si las credenciales no coinciden
    document.getElementById("login-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Evita el envío del formulario

        var form = event.target;
        var formData = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Credenciales incorrectas");
            }
            return response.json();
        })
        .then(data => {
            window.location.href = data.redirect_url;
        })
        .catch(error => {
            showErrorModal();
        });
    });
});
