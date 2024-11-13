document.addEventListener('DOMContentLoaded', () => {
    const carreraSelect = document.getElementById('carrera');
    const cicloSelect = document.getElementById('ciclo');
    const cursoSelect = document.getElementById('curso');
    const tipoPreguntaRadios = document.querySelectorAll('input[name="tipoPregunta"]');
    const academicaFields = document.getElementById('academicaFields');
    const botonPublicar = document.querySelector('.botonPublicar');
    const mensajeCurso = document.getElementById('mensajeCurso');

    // Mostrar/Ocultar campos de pregunta académica
    tipoPreguntaRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (document.getElementById('academica').checked) {
                academicaFields.style.display = 'block';
            } else {
                academicaFields.style.display = 'none';
            }
        });
    });

    carreraSelect.addEventListener('change', () => {
        // Ocultar mensaje y habilitar botón cuando se selecciona una carrera
        mensajeCurso.style.display = 'none';
        botonPublicar.disabled = false;
        updateCursos();
    });

    cicloSelect.addEventListener('change', () => {
        // Mostrar mensaje y deshabilitar botón cuando se selecciona un ciclo
        if (!cursoSelect.value) {
            mensajeCurso.style.display = 'block';
            botonPublicar.disabled = true;
        } else {
            mensajeCurso.style.display = 'none';
            botonPublicar.disabled = false;
        }
        updateCursos();
    });

    cursoSelect.addEventListener('change', () => {
        // Ocultar mensaje y habilitar botón cuando se selecciona un curso
        mensajeCurso.style.display = 'none';
        botonPublicar.disabled = false;
    });

    function updateCursos() {
        const selectedCarrera = carreraSelect.value;
        const selectedCiclo = cicloSelect.value;

        // Solo proceder si ambos valores están seleccionados
        if (!selectedCarrera || !selectedCiclo) {
            cursoSelect.innerHTML = '<option value="">Seleccionar curso</option>';
            botonPublicar.disabled = true;
            mensajeCurso.style.display = 'none';
            return;
        }

        const url = `https://fastapi-340032812084.us-central1.run.app/curso/${selectedCarrera}/${selectedCiclo}`;
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
