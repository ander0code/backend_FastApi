document.addEventListener('DOMContentLoaded', function () {
    const carreraSelect = document.getElementById('carrera');
    const cicloSelect = document.getElementById('ciclo');
    const cursoSelect = document.getElementById('curso');

    function fetchCursos(carreraId, ciclo) {
        fetch(`https://fastapi-340032812084.us-central1.run.app/curso/${carreraId}/${ciclo}`)
            .then(response => response.json())
            .then(data => {
                // Limpiar las opciones anteriores
                cursoSelect.innerHTML = '<option value="">Seleccionar curso</option>';

                // Agregar las nuevas opciones
                data.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso.id;
                    option.textContent = curso.nombre;
                    cursoSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching cursos:', error);
            });
    }

    function actualizarCursos() {
        const carreraId = carreraSelect.value;
        const ciclo = cicloSelect.value;

        if (carreraId && ciclo) {
            fetchCursos(carreraId, ciclo);
        } else {
            // Limpiar el select de cursos si no hay carrera o ciclo seleccionados
            cursoSelect.innerHTML = '<option value="">Seleccionar curso</option>';
        }
    }

    carreraSelect.addEventListener('change', actualizarCursos);
    cicloSelect.addEventListener('change', actualizarCursos);
});