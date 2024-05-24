document.addEventListener('DOMContentLoaded', () => {
    const carreraBtn = document.getElementById('carrera-btn');
    const cicloBtn = document.getElementById('ciclo-btn');
    const cursoBtn = document.getElementById('curso-btn');
    const filtrarBtn = document.getElementById('filtrar-btn');
    const limpiarBtn = document.getElementById('limpiar-btn');
  
    const carreraOptions = document.querySelectorAll('.carrera-option');
    const cicloOptions = document.querySelectorAll('.ciclo-option');
    const cursoOptions = document.querySelectorAll('.curso-option');
  
    const defaultCarreraText = 'Carrera';
    const defaultCicloText = 'Ciclo';
    const defaultCursoText = 'Curso';
  
    // Deshabilitar botones inicialmente
    cicloBtn.classList.add('disabled');
    cursoBtn.classList.add('disabled');
    filtrarBtn.disabled = true;
    filtrarBtn.classList.add('disabled');
  
    // Habilitar botón Ciclo cuando se selecciona una carrera
    carreraOptions.forEach(option => {
      option.addEventListener('click', (event) => {
        event.preventDefault();
        const carreraName = option.querySelector('span').textContent;
        carreraBtn.querySelector('span').textContent = carreraName;
        cicloBtn.classList.remove('disabled');
        filtrarBtn.disabled = false;
        filtrarBtn.classList.remove('disabled');
        // Cerrar automáticamente el menú desplegable de Carrera
        const componentsNav = document.getElementById('components-nav');
        if (componentsNav.classList.contains('show')) {
          carreraBtn.click(); // Cerrar el menú desplegable
        }
      });
    });
  
    // Habilitar botón Curso cuando se selecciona un ciclo
    cicloOptions.forEach(option => {
      option.addEventListener('click', (event) => {
        event.preventDefault();
        const cicloName = option.querySelector('span').textContent;
        cicloBtn.querySelector('span').textContent = cicloName;
        cursoBtn.classList.remove('disabled');
        // Cerrar automáticamente el menú desplegable de Ciclo
        const cicloNav = document.getElementById('ciclo-nav');
        if (cicloNav.classList.contains('show')) {
          cicloBtn.click(); // Cerrar el menú desplegable
        }
      });
    });
  
    // Cambiar texto del botón de Curso cuando se selecciona un curso
    cursoOptions.forEach(option => {
      option.addEventListener('click', (event) => {
        event.preventDefault();
        const cursoName = option.querySelector('span').textContent;
        cursoBtn.querySelector('span').textContent = cursoName;
        // Cerrar automáticamente el menú desplegable de Curso
        const formsNav = document.getElementById('forms-nav');
        if (formsNav.classList.contains('show')) {
          cursoBtn.click(); // Cerrar el menú desplegable
        }
      });
    });
  
    // Añadir funcionalidad al botón Limpiar
    limpiarBtn.addEventListener('click', () => {
      // Restaurar el texto de los botones a su estado por defecto
      carreraBtn.querySelector('span').textContent = defaultCarreraText;
      cicloBtn.querySelector('span').textContent = defaultCicloText;
      cursoBtn.querySelector('span').textContent = defaultCursoText;
  
      // Deshabilitar los botones Ciclo, Curso y Filtrar
      cicloBtn.classList.add('disabled');
      cursoBtn.classList.add('disabled');
      filtrarBtn.disabled = true;
      filtrarBtn.classList.add('disabled');
    });
  });
