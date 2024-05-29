document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var alert = document.getElementById('alert');
    alert.textContent = 'Datos enviados';
    alert.classList.add('show');

    // Añadir animación de desvanecimiento después del envío
    this.classList.add('fadeOutUp');
    setTimeout(() => {
        this.reset();
        this.classList.remove('fadeOutUp');
        this.classList.add('fadeInUp');

        // Ocultar la alerta después de unos segundos
        setTimeout(() => {
            alert.classList.remove('show');
        }, 3000); // Duración de la alerta visible
    }, 1000); // Duración de la animación
});
