document.addEventListener('DOMContentLoaded', () => {
  fetch('http://127.0.0.1:8000/posts_nuevo/')
      .then(response => {
          if (!response.ok) {
              throw new Error('No se pudo obtener los posts');
          }
          return response.json();
      })
      .then(posts => {
          const postContainer = document.getElementById('post-container');

          if (!Array.isArray(posts)) {
              throw new Error('La respuesta no es un array');
          }

          posts.forEach(post => {
              // Crear un nuevo div para representar la publicación
              const newPost = document.createElement('div');
              newPost.className = 'activity-item d-flex flex-column p-2 mb-2 border';

              // Asignar los valores a los elementos del post
              newPost.innerHTML = `
                  <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="activite-label post-date">${post.post.fecha_Creacion ? new Date(post.post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible'}</span>
                      <i class="bi bi-circle-fill activity-badge text-success align-self-start"></i>
                  </div>
                  <div class="activity-content">
                      <a href="#" class="fw-bold text-dark post-title">${post.post.titulo || 'Título no disponible'}</a>
                      <div class="text-muted">por <span class="post-author">${post.post.propietarioNombre || 'Autor no disponible'}</span></div>
                      <div class="post-tags"></div>
                  </div>
                  <div class="d-flex justify-content-between mt-2">
                      <span class="post-votes">${post.post.conteo_favoritos || 0} Favoritos</span>
                      <span class="post-replies">${post.post.recuento_comentarios || 0} Comentarios</span>
                      <span class="post-views">${post.post.conteo_visitas || 0} Visitas</span>
                  </div>
              `;

              // Etiquetas
              const tagsContainer = newPost.querySelector('.post-tags');
              tagsContainer.innerHTML = ''; // Limpiar etiquetas anteriores

              // Generar etiquetas de carrera, ciclo y curso
              const carreraTag = post.carrera ? post.carrera.etiquetaNombre : null;
              const cicloTag = post.curso && post.curso.ciclo ? `Ciclo ${post.curso.ciclo}` : null;
              const cursoTag = post.curso ? post.curso.nombre_curso : null;

              // Añadir etiquetas al contenedor
              [carreraTag, cicloTag, cursoTag].forEach(tag => {
                  if (tag) {
                      const tagLink = document.createElement('a');
                      tagLink.href = '#';
                      tagLink.className = 'tag';
                      tagLink.textContent = tag;
                      tagsContainer.appendChild(tagLink);
                  }
              });

              // Si no hay etiquetas, agregar una etiqueta "General"
              if (!carreraTag && !cicloTag && !cursoTag) {
                  const generalTag = document.createElement('a');
                  generalTag.href = '#';
                  generalTag.className = 'tag';
                  generalTag.textContent = 'General';
                  tagsContainer.appendChild(generalTag);
              }

              // Agregar la publicación al contenedor
              postContainer.appendChild(newPost);
          });
      })
      .catch(error => {
          console.error('Error al obtener los posts:', error);
      });
});
