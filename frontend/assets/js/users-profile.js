document.addEventListener("DOMContentLoaded", () => {
    // Efecto de transición al cargar el perfil
    const bio = document.querySelector(".perfil-usuario-bio");
    const footer = document.querySelector(".perfil-usuario-footer");

    setTimeout(() => {
        bio.style.opacity = 1;
        footer.style.opacity = 1;
    }, 500);

    // Añadir más interacciones dinámicas
    const avatar = document.querySelector(".perfil-usuario-avatar img");
    avatar.addEventListener("mouseover", () => {
        avatar.style.transform = "scale(1.2)";
    });

    avatar.addEventListener("mouseout", () => {
        avatar.style.transform = "scale(1)";
    });
});
