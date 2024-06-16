document.addEventListener('DOMContentLoaded', function() {
    const estrellasCalidad = document.getElementById('calidad');
    const descripcionCalidad = document.getElementById('descripcion-calidad');
    const estrellasDificultad = document.getElementById('dificultad');
    const descripcionDificultad = document.getElementById('descripcion-dificultad');

    function actualizarDescripcion(event) {
        const tipo = event.currentTarget.getAttribute('data-tipo');
        const descripcion = event.target.getAttribute('data-descripcion');
        if (tipo === 'calidad') {
            descripcionCalidad.textContent = descripcion;
        } else if (tipo === 'dificultad') {
            descripcionDificultad.textContent = descripcion;
        }
    }

    function limpiarDescripcion(event) {
        const tipo = event.currentTarget.getAttribute('data-tipo');
        if (tipo === 'calidad') {
            descripcionCalidad.textContent = '';
        } else if (tipo === 'dificultad') {
            descripcionDificultad.textContent = '';
        }
    }

    estrellasCalidad.addEventListener('mouseover', actualizarDescripcion);
    estrellasCalidad.addEventListener('mouseout', limpiarDescripcion);
    estrellasDificultad.addEventListener('mouseover', actualizarDescripcion);
    estrellasDificultad.addEventListener('mouseout', limpiarDescripcion);

    const enviarBtn = document.getElementById('enviarBtn');

    function setModalAttributes() {
        enviarBtn.setAttribute('data-bs-toggle', 'modal');
        enviarBtn.setAttribute('data-bs-target', '#confirmarEnvioModal');
    }

    enviarBtn.addEventListener('click', function(event) {
        const cursoMateria = document.getElementById('curso-materia').value.trim();
        const calidad = document.querySelector('input[name="calidad"]:checked');
        const dificultad = document.querySelector('input[name="dificultad"]:checked');
        const tomariaDeNuevo = document.querySelector('input[name="tomaria-denuevo"]:checked');
        const comentario = document.getElementById('comentario').value.trim();
        const etiquetasSeleccionadas = document.querySelectorAll('input[type="checkbox"]:checked').length;

        let formularioCompleto = true;

        if (!cursoMateria || !calidad || !dificultad || !tomariaDeNuevo || !comentario) {
            const alerta = document.getElementById('alerta-envio-fallido');
            alerta.classList.remove('d-none');
            setTimeout(() => alerta.classList.add('d-none'), 3000);
            formularioCompleto = false;
        }

        if (etiquetasSeleccionadas === 0) {
            const alerta = document.getElementById('alerta-etiquetas-min');
            alerta.classList.remove('d-none');
            setTimeout(() => alerta.classList.add('d-none'), 3000);
            formularioCompleto = false;
        }

        if (formularioCompleto) {
            setModalAttributes();  // Set modal attributes if the form is complete
            const modal = new bootstrap.Modal(document.getElementById('confirmarEnvioModal'));
            modal.show();
        } else {
            enviarBtn.removeAttribute('data-bs-toggle');
            enviarBtn.removeAttribute('data-bs-target');
        }
    });

    const confirmarEnvioBtn = document.getElementById('confirmarEnvio');
    confirmarEnvioBtn.addEventListener('click', function() {
        document.getElementById('calificar-form').submit();
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            if (checkedCheckboxes.length > 3) {
                checkbox.checked = false;
                const alerta = document.getElementById('alerta-etiquetas-max');
                alerta.classList.remove('d-none');
                setTimeout(() => alerta.classList.add('d-none'), 3000);
            }
        });
    });
});
