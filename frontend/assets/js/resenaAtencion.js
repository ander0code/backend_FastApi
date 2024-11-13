document.addEventListener("DOMContentLoaded", function () {
    const enviarBtn = document.getElementById("enviarBtn");
    const confirmarEnvioBtn = document.getElementById("confirmarEnvio");
    const confirmarEnvioModal = new bootstrap.Modal(document.getElementById("confirmarEnvioModal"));
    const alertaEtiquetasMax = document.getElementById("alerta-etiquetas-max");
    const alertaEnvioFallido = document.getElementById("alerta-envio-fallido");
    const alertaEnvioExitoso = document.getElementById("alerta-envio-exitoso");
    const NombreProfeCalificar = document.querySelector(".NombreProfeCalificar");

    // Get logged in user's email from localStorage
    const userEmail = localStorage.getItem("email");

    // Get user's ID using the provided endpoint
    fetch(`https://fastapi-340032812084.us-central1.run.app/users_nuevo/${userEmail}`)
        .then(response => response.json())
        .then(userData => {
            const userId = userData[0].id;
            console.log("userId:", userId);

            // Get idProfesor from URL
            const urlParams = new URLSearchParams(window.location.search);
            const idProfesor = urlParams.get('id');
            console.log("idProfesor:", idProfesor);

            // Get profesor's information using the provided endpoint
            fetch(`https://fastapi-340032812084.us-central1.run.app/get_profesores_ID/${idProfesor}`)
                .then(response => response.json())
                .then(profesorData => {
                    const profesor = profesorData[0];
                    NombreProfeCalificar.textContent = profesor.nombre_Profesor;

                    // Event listener for enviarBtn click
                    enviarBtn.addEventListener("click", function () {
                        // Validate form
                        const cursoMateria = document.getElementById("curso-materia").value.trim();
                        const calidad = document.querySelector('input[name="calidad"]:checked');
                        const dificultad = document.querySelector('input[name="dificultad"]:checked');
                        const recomendar = document.querySelector('input[name="tomaria-denuevo"]:checked');
                        const etiquetas = document.querySelectorAll('input[type="checkbox"]:checked');
                        const comentario = document.getElementById("comentario").value.trim();

                        if (!cursoMateria || !calidad || !dificultad || !recomendar || etiquetas.length === 0 || comentario === "") {
                            alertaEnvioFallido.classList.remove("d-none");
                            return;
                        }

                        if (etiquetas.length > 3) {
                            alertaEtiquetasMax.classList.remove("d-none");
                            return;
                        } else {
                            alertaEtiquetasMax.classList.add("d-none");
                        }

                        // Prepare data for POST request
                        const calidadValue = calidad.value;
                        const dificultadValue = dificultad.value;
                        const recomendacionValue = recomendar.value === "SI";
                        const etiquetasValues = Array.from(etiquetas).map(checkbox => checkbox.value);

                        const postData = {
                            "ciclo": 0,
                            "nameCurso": cursoMateria,
                            "calidad": parseInt(calidadValue),
                            "dificultad": parseInt(dificultadValue),
                            "recomendacion": recomendacionValue,
                            "etiquetas": etiquetasValues,
                            "resena": comentario
                        };

                        // Confirm submission
                        confirmarEnvioModal.show();

                        // Event listener for confirmarEnvioBtn click
                        confirmarEnvioBtn.addEventListener("click", function () {
                            // Insert calificacion using the provided endpoint
                            fetch(`https://fastapi-340032812084.us-central1.run.app/Insert_Calificacion/${userId}/${idProfesor}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(postData)
                            })
                                .then(response => {
                                    if (response.ok) {
                                        alertaEnvioExitoso.classList.remove("d-none");
                                        // Redirect to infoDocente
                                        window.location.href = `/autenticacion/infdoc?id=${idProfesor}`;
                                    } else {
                                        alertaEnvioFallido.classList.remove("d-none");
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    alertaEnvioFallido.classList.remove("d-none");
                                });
                        });
                    });
                })
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
});
