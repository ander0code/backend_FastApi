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

  let selectedCarrera = null;
  let selectedCiclo = null;
  let selectedCurso = null;

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
      selectedCarrera = option.getAttribute('data-value');
      cicloBtn.classList.remove('disabled');
      cursoBtn.classList.add('disabled');
      cursoBtn.querySelector('span').textContent = defaultCursoText; // Resetear texto de curso
      selectedCiclo = null;
      selectedCurso = null;
      filtrarBtnCheck(); // Verificar si se debe habilitar el botón de filtrar
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
      selectedCiclo = option.getAttribute('data-value');
      cursoBtn.classList.remove('disabled');
      selectedCurso = null;
      filtrarBtnCheck(); // Verificar si se debe habilitar el botón de filtrar
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
      selectedCurso = option.getAttribute('data-value');
      filtrarBtnCheck(); // Verificar si se debe habilitar el botón de filtrar
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

    // Resetear las variables de selección
    selectedCarrera = null;
    selectedCiclo = null;
    selectedCurso = null;
  });

  // Verificar si se debe habilitar el botón de filtrar
  function filtrarBtnCheck() {
    if (selectedCarrera) {
      filtrarBtn.disabled = false;
      filtrarBtn.classList.remove('disabled');
    } else {
      filtrarBtn.disabled = true;
      filtrarBtn.classList.add('disabled');
    }
  }

  // Añadir funcionalidad al botón Filtrar
  filtrarBtn.addEventListener('click', () => {
    if (selectedCarrera) {
      // Ejecutar la acción deseada con las variables seleccionadas
      console.log(`Carrera seleccionada: ${selectedCarrera}`);
      if (selectedCiclo) {
        console.log(`Ciclo seleccionado: ${selectedCiclo}`);
      }
      if (selectedCurso) {
        console.log(`Curso seleccionado: ${selectedCurso}`);
      }
      // Aquí puedes realizar una solicitud a tu API o cualquier otra acción necesaria
    } else {
      console.error('Debe seleccionar una carrera antes de filtrar.');
    }
  });
});


