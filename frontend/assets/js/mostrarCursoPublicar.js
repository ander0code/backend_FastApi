document.addEventListener('DOMContentLoaded', () => {
    const carreraSelect = document.getElementById('carrera');
    const cicloSelect = document.getElementById('ciclo');
    const cursoSelect = document.getElementById('curso');

    carreraSelect.addEventListener('change', () => {
        updateCursos();
    });

    cicloSelect.addEventListener('change', () => {
        updateCursos();
    });

    function updateCursos() {
        const selectedCarrera = carreraSelect.value;
        const selectedCiclo = cicloSelect.value;

        // Solo proceder si ambos valores están seleccionados
        if (!selectedCarrera || !selectedCiclo) {
            cursoSelect.innerHTML = '<option value="">Seleccionar curso</option>';
            return;
        }

        const url = `http://127.0.0.1:8000/curso/${selectedCarrera}/${selectedCiclo}`;
        console.log(`Fetching cursos from URL: ${url}`);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los cursos');
                }
                return response.json();
            })
            .then(cursos => {
                cursoSelect.innerHTML = '<option value="">Seleccionar curso</option>'; // Limpiar cursos anteriores
                if (Array.isArray(cursos) && cursos.length > 0) {
                    cursos.forEach(curso => {
                        const option = document.createElement('option');
                        option.value = curso.id_curso;
                        option.textContent = curso.nombre_curso;
                        cursoSelect.appendChild(option);
                    });
                } else {
                    cursoSelect.innerHTML = '<option value="">No se encontraron cursos</option>';
                }
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
                cursoSelect.innerHTML = '<option value="">Error al cargar cursos</option>';
            });
    }
});
