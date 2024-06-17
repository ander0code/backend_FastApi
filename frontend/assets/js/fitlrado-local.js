document.querySelectorAll('.location-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe

        // Obtiene el valor de la opción seleccionada
        const selectedValue = this.getAttribute('data-value');

        // Realiza el filtrado según el valor seleccionado
        filterLocations(selectedValue);
    });
});

function filterLocations(value) {
    // Lógica de filtrado
    console.log('Filtrar por valor:', value);

    // Ejemplo de filtrado: muestra solo los elementos que coincidan con el valor seleccionado
    document.querySelectorAll('.post').forEach(post => {
        if (value === 'null' || post.getAttribute('data-location') === value) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

