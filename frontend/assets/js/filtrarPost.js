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

    inicializarBotones();

    carreraOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            manejarSeleccion(option, carreraBtn, 'carrera', cicloBtn, cursoBtn);
        });
    });

    cicloOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            manejarSeleccion(option, cicloBtn, 'ciclo', cursoBtn);
        });
    });

    cursoOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            manejarSeleccion(option, cursoBtn, 'curso');
        });
    });

    limpiarBtn.addEventListener('click', limpiarFiltros);

    filtrarBtn.addEventListener('click', () => {
        if (selectedCarrera) {
            fetchAndDisplayPosts(selectedCarrera, selectedCiclo, selectedCurso);
        } else {
            console.error('Debe seleccionar una carrera antes de filtrar.');
        }
    });

    function inicializarBotones() {
        cicloBtn.classList.add('disabled');
        cursoBtn.classList.add('disabled');
        filtrarBtn.disabled = true;
        filtrarBtn.classList.add('disabled');
    }

    function manejarSeleccion(option, button, tipo, siguienteBtn1, siguienteBtn2) {
        const nombre = option.querySelector('span').textContent;
        button.querySelector('span').textContent = nombre;
        const valor = option.getAttribute('data-value');
        
        switch (tipo) {
            case 'carrera':
                selectedCarrera = valor;
                selectedCiclo = null;
                selectedCurso = null;
                siguienteBtn1.classList.remove('disabled');
                siguienteBtn1.querySelector('span').textContent = defaultCicloText;
                siguienteBtn2.classList.add('disabled');
                siguienteBtn2.querySelector('span').textContent = defaultCursoText;
                break;
            case 'ciclo':
                selectedCiclo = valor;
                selectedCurso = null;
                siguienteBtn1.classList.remove('disabled');
                siguienteBtn1.querySelector('span').textContent = defaultCursoText;
                break;
            case 'curso':
                selectedCurso = valor;
                break;
        }
        filtrarBtnCheck();
        closeDropdown(button);
    }

    function limpiarFiltros() {
        carreraBtn.querySelector('span').textContent = defaultCarreraText;
        cicloBtn.querySelector('span').textContent = defaultCicloText;
        cursoBtn.querySelector('span').textContent = defaultCursoText;

        inicializarBotones();

        selectedCarrera = null;
        selectedCiclo = null;
        selectedCurso = null;

        closeDropdown(carreraBtn);
        closeDropdown(cicloBtn);
        closeDropdown(cursoBtn);

        limpiarContenedorPosts();
    }

    function filtrarBtnCheck() {
        if (selectedCarrera) {
            filtrarBtn.disabled = false;
            filtrarBtn.classList.remove('disabled');
        } else {
            filtrarBtn.disabled = true;
            filtrarBtn.classList.add('disabled');
        }
    }

    function closeDropdown(button) {
        const dropdown = button.nextElementSibling;
        if (dropdown.classList.contains('show')) {
            button.click();
        }
    }

    function limpiarContenedorPosts() {
        const postContainer = document.getElementById('post-container');
        postContainer.innerHTML = '';
    }
});

function fetchAndDisplayPosts(selectedCarrera, selectedCiclo, selectedCurso) {
    let url = `http://127.0.0.1:8000/posts/${selectedCarrera}`;
    if (selectedCiclo) url += `/${selectedCiclo}`;
    if (selectedCurso) url += `/${selectedCurso}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo obtener los posts');
            return response.json();
        })
        .then(posts => {
            if (!Array.isArray(posts)) throw new Error('La respuesta no es un array');
            renderPosts(posts);
        })
        .catch(error => console.error('Error al obtener los posts:', error));
}

function renderPosts(posts) {
    const postContainer = document.getElementById('post-container');
    const postTemplate = document.getElementById('post-template');

    limpiarContenedorPosts();

    posts.forEach(item => {
        const post = item.post;
        const carrera = item.carrera;
        const curso = item.curso;

        if (postTemplate && postTemplate.content) {
            const newPost = document.importNode(postTemplate.content, true);
            newPost.querySelector('.post-title').textContent = post.titulo || 'Título no disponible';
            newPost.querySelector('.post-title').href = './text.html';
            newPost.querySelector('.post-date').textContent = post.fecha_Creacion ? new Date(post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible';
            newPost.querySelector('.post-author').textContent = post.propietarioNombre || 'Autor no disponible';

            const tagsContainer = newPost.querySelector('.post-tags');
            tagsContainer.innerHTML = '';

            let hasTags = false;
            if (carrera && carrera.etiquetaNombre) {
                const carreraTag = document.createElement('span');
                carreraTag.className = 'badge bg-primary text-light';
                carreraTag.textContent = carrera.etiquetaNombre;
                tagsContainer.appendChild(carreraTag);
                hasTags = true;
            }
            if (curso && curso.ciclo !== null) {
                const cicloTag = document.createElement('span');
                cicloTag.className = 'badge bg-warning text-dark';
                cicloTag.textContent = `Ciclo ${curso.ciclo}`;
                tagsContainer.appendChild(cicloTag);
                hasTags = true;
            }
            if (curso && curso.nombre_curso) {
                const cursoTag = document.createElement('span');
                cursoTag.className = 'badge bg-secondary text-light';
                cursoTag.textContent = curso.nombre_curso;
                tagsContainer.appendChild(cursoTag);
                hasTags = true;
            }

            if (!hasTags) {
                const generalTag = document.createElement('span');
                generalTag.className = 'badge bg-success text-light';
                generalTag.textContent = 'General';
                tagsContainer.appendChild(generalTag);
            }

            newPost.querySelector('.post-votes').textContent = `${post.conteo_favoritos || 0} Favoritos`;
            newPost.querySelector('.post-replies').textContent = `${post.recuento_comentarios || 0} Comentarios`;
            newPost.querySelector('.post-views').textContent = `${post.conteo_visitas || 0} Visitas`;

            postContainer.appendChild(newPost);
        } else {
            console.error('El template de post no se encuentra o no es válido.');
        }
    });
}

function limpiarContenedorPosts() {
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = '';
}
