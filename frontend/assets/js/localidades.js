document.addEventListener("DOMContentLoaded", function () {
    const publicacionesDiv = document.getElementById("publicaciones");
    const publicarForm = document.getElementById("publicar-form");
    const publicarButton = document.getElementById("publicar-button");
    const cancelarButton = document.getElementById("cancelar-button");
    const publicacionesTitle = document.getElementById("publicaciones-title");
    const imageBoxes = document.querySelectorAll(".image-boxrrr");
    const headerTitle = document.getElementById("header-title");
    const headerImg = document.getElementById("header-img");
    const localidadesBox = document.getElementById("localidades-box");

    function resetHeader() {
        headerTitle.innerText = "LOCALIDADES";
        headerImg.src = "./assets/img/autonoma.jpg";
    }

    function showAllLocations() {
        resetHeader();
        publicacionesTitle.innerText = "Publicaciones";
        localidadesBox.classList.add('hiddenrrr');
        // Mostrar todos los boxes de lugares excepto el de localidades
        imageBoxes.forEach(box => {
            if (box !== localidadesBox) {
                box.classList.remove('hiddenrrr');
            }
        });
    }

    imageBoxes.forEach(box => {
        box.addEventListener("click", function () {
            const title = box.getAttribute("data-title");
            const img = box.getAttribute("data-img");

            headerTitle.innerText = title;
            headerImg.src = img;

            localidadesBox.classList.remove('hiddenrrr');

            // Ocultar solo el image-box correspondiente
            box.classList.add('hiddenrrr');

            // Mostrar todos los boxes de lugares excepto el clicado y el de localidades
            imageBoxes.forEach(otherBox => {
                if (otherBox !== box && otherBox !== localidadesBox) {
                    otherBox.classList.remove('hiddenrrr');
                }
            });
        });
    });

    localidadesBox.addEventListener("click", showAllLocations);

    publicarButton.addEventListener("click", function () {
        if (publicarForm.classList.contains("hiddenrrr")) {
            publicacionesDiv.classList.add("hiddenrrr");
            publicarForm.classList.remove("hiddenrrr");
            publicarButton.innerText = "Ver Publicaciones";
        } else {
            publicacionesDiv.classList.remove("hiddenrrr");
            publicarForm.classList.add("hiddenrrr");
            publicarButton.innerText = "Publicar";
        }
    });

    cancelarButton.addEventListener("click", function () {
        publicarForm.classList.add("hiddenrrr");
        publicacionesDiv.classList.remove("hiddenrrr");
        publicarButton.innerText = "Publicar";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll('.toggle-buttonrrr');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detailsWrapper = this.previousElementSibling;
            detailsWrapper.classList.toggle('expanded');
            if (detailsWrapper.classList.contains('expanded')) {
                this.textContent = 'Ver menos';
            } else {
                this.textContent = 'Ver más';
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const stars = document.querySelectorAll('.starsrrr .star');
    let currentRating = 0; // Variable para almacenar la calificación actual

    stars.forEach(star => {
        star.addEventListener('mouseover', function () {
            highlightStars(this);
        });

        star.addEventListener('mouseout', function () {
            if (currentRating === 0) {
                resetStars();
            } else {
                highlightStars(stars[currentRating - 1]);
            }
        });

        star.addEventListener('click', function () {
            currentRating = Array.from(stars).indexOf(this) + 1;
            highlightStars(this);
            console.log(`Calificación seleccionada: ${currentRating}`);
            // Aquí puedes almacenar la calificación en una variable o hacer algo con ella
            // Por ejemplo, puedes asignarla a un campo oculto en el formulario
        });
    });

    function highlightStars(selectedStar) {
        resetStars();
        const starIndex = Array.from(stars).indexOf(selectedStar);
        for (let i = 0; i <= starIndex; i++) {
            stars[i].classList.add('selected');
        }
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('selected');
        });
    }
});



