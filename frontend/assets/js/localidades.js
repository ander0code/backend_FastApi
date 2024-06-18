document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', () => {
        const detailsWrapper = button.previousElementSibling;
        detailsWrapper.classList.toggle('expanded');
        button.textContent = detailsWrapper.classList.contains('expanded') ? 'Ver menos' : 'Ver más';
    });
});
