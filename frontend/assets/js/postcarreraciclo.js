document.addEventListener('DOMContentLoaded', () => {
    let selectedCarrera = null;
    let selectedCiclo = null;

    document.querySelectorAll('.carrera-option').forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCarrera = this.getAttribute('data-value');
            selectedCiclo = null;  // Reset ciclo when a new carrera is selected
            document.getElementById('curso-btn').classList.add('disabled');
            document.querySelector('#ciclo-btn span').textContent = "Ciclo"; // Reset ciclo button text
            document.querySelector('#curso-btn span').textContent = "Curso"; // Reset curso button text
            document.querySelector('#forms-nav').classList.remove('show'); // Close curso dropdown
            updateCicloButton();
        });
    });

    document.querySelectorAll('.ciclo-option').forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            selectedCiclo = this.getAttribute('data-value');
            document.querySelector('#ciclo-btn span').textContent = this.querySelector('span').textContent;
            document.querySelector('#curso-btn span').textContent = "Curso"; // Reset curso button text
            document.getElementById('curso-btn').classList.add('disabled'); // Disable curso button
            fetchAndDisplayCursos();
        });
    });

    function updateCicloButton() {
        if (selectedCarrera) {
            document.getElementById('ciclo-btn').classList.remove('disabled');
        }
    }

    function fetchAndDisplayCursos() {
        if (!selectedCarrera || !selectedCiclo) {
            console.error('Debe seleccionar una carrera y un ciclo antes de filtrar.');
            return;
        }

        const url = `http://127.0.0.1:8000/curso/${selectedCarrera}/${selectedCiclo}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los cursos');
                }
                return response.json();
            })
            .then(cursos => {
                const cursoNav = document.getElementById('forms-nav');
                cursoNav.innerHTML = '';  // Limpiar el contenedor de cursos antes de agregar nuevos cursos

                if (!Array.isArray(cursos)) {
                    throw new Error('La respuesta no es un array');
                }

                cursos.forEach(curso => {
                    const cursoItem = document.createElement('li');
                    cursoItem.innerHTML = `
                        <a href="#" class="curso-option" data-value="${curso.id_curso}">
                            <i class="bi bi-circle"></i><span>${curso.nombre_curso}</span>
                        </a>`;
                    cursoNav.appendChild(cursoItem);
                });

                document.getElementById('curso-btn').classList.remove('disabled');

                // Añadir event listeners a las nuevas opciones de curso
                document.querySelectorAll('.curso-option').forEach(option => {
                    option.addEventListener('click', function(event) {
                        event.preventDefault();
                        const cursoName = this.querySelector('span').textContent;
                        document.getElementById('curso-btn').querySelector('span').textContent = cursoName;
                        const cursoValue = this.getAttribute('data-value');
                        console.log('Curso seleccionado:', cursoValue);
                        document.querySelector('#forms-nav').classList.remove('show'); // Close dropdown
                        // Aquí puedes agregar lógica para manejar la selección del curso
                    });
                });
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
                // Podrías agregar aquí código para mostrar un mensaje al usuario, etc.
            });
    }
});
