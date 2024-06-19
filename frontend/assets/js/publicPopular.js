document.addEventListener('DOMContentLoaded', () => {
    let posts = []; // Variable para almacenar los posts obtenidos
  
    // Función para obtener los posts y mostrarlos
    const obtenerYMostrarPosts = () => {
      fetch('http://127.0.0.1:8000/posts_nuevo/')
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo obtener los posts');
          }
          return response.json();
        })
        .then(data => {
          posts = data; // Almacenar los posts en la variable posts
  
          // Ordenar los posts por defecto por recuento de comentarios
          ordenarPosts('comentarios');
        })
        .catch(error => console.error('Error:', error));
    };
  
    // Función para ordenar los posts según el criterio seleccionado
    const ordenarPosts = (criterio) => {
      switch (criterio) {
        case 'vistas':
          posts.sort((a, b) => b.post.conteo_visitas - a.post.conteo_visitas);
          break;
        case 'votos':
          posts.sort((a, b) => b.votos.cantidad - a.votos.cantidad);
          break;
        case 'comentarios':
        default:
          posts.sort((a, b) => b.post.recuento_comentarios - a.post.recuento_comentarios);
          break;
      }
  
      mostrarPosts();
    };
  
    // Función para mostrar los primeros cinco posts en la sección de Publicaciones Populares
    const mostrarPosts = () => {
      const popularPostsContainer = document.getElementById('popular-posts');
  
      // Limpiar el contenedor antes de añadir nuevas publicaciones
      popularPostsContainer.innerHTML = '';
  
      // Tomar las cinco publicaciones más relevantes
      const topFivePosts = posts.slice(0, 5);
  
      // Iterar sobre los topFivePosts y crear elementos HTML para cada post
      topFivePosts.forEach(item => {
        const post = item.post;
        const carrera = item.carrera || {};
        const curso = item.curso || {};
  
        // Crear el elemento de publicación popular
        const newPopularPost = document.createElement('div');
        newPopularPost.classList.add('activity-item', 'd-flex', 'flex-column', 'p-2', 'mb-2', 'border');
  
        newPopularPost.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="activite-label">${post.fecha_Creacion}</span>
            <i class="bi bi-circle-fill activity-badge text-success align-self-start"></i>
          </div>
          <div class="activity-content">
            <a href="/autenticacion/texto?post_id=${post.id}" class="fw-bold text-dark post-title">${post.titulo}</a>
            <div class="post-meta">por <span class="post-author"><a href="/autenticacion/perfils?id=${post.propietarioUserID}" class="goPerfil">${post.propietarioNombre || 'Autor no disponible'}</a></span> el ${post.fecha_Creacion || 'Fecha no disponible'}</div>
            <div class="post-tags mt-2">
              <!-- Las etiquetas se agregarán dinámicamente mediante JavaScript -->
            </div>
          </div>
        `;
  
        // Agregar etiquetas de carrera y curso si están disponibles
        const tagsContainer = newPopularPost.querySelector('.post-tags');
        tagsContainer.innerHTML = ''; // Limpiar etiquetas anteriores
        let hasTags = false;
  
        if (carrera.etiquetaNombre) {
          const carreraTag = document.createElement('span');
          carreraTag.textContent = carrera.etiquetaNombre;
          tagsContainer.appendChild(carreraTag);
          hasTags = true;
        }
        if (curso.nombre_curso) {
          const cursoTag = document.createElement('span');
          cursoTag.textContent = curso.nombre_curso;
          tagsContainer.appendChild(cursoTag);
          hasTags = true;
        }
  
        if (!hasTags) {
          const generalTag = document.createElement('span');
          generalTag.textContent = 'General';
          tagsContainer.appendChild(generalTag);
        }
  
        // Agregar el nuevo post popular al contenedor
        popularPostsContainer.appendChild(newPopularPost);
      });
    };
  
    // Función para manejar el cambio en el criterio de ordenación
    window.ordenarPor = (criterio) => {
      ordenarPosts(criterio);
    };
  
    // Al cargar la página, obtener y mostrar los posts
    obtenerYMostrarPosts();
  });
  