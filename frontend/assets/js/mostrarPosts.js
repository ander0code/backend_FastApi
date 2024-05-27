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
        const postTemplate = document.getElementById('post-template').content;
  
        if (!Array.isArray(posts)) {
          throw new Error('La respuesta no es un array');
        }
  
        posts.forEach(post => {
          const newPost = postTemplate.cloneNode(true);
          newPost.querySelector('.activity-item').style.display = ''; // Remover el display none para que sea visible
  
          // Asignar los valores a los elementos del post
          newPost.querySelector('.post-title').textContent = post.post.titulo || 'Título no disponible';
          newPost.querySelector('.post-title').href = './text.html'; // Esto debería actualizarse si el link debe variar por post
          newPost.querySelector('.post-date').textContent = post.post.fecha_Creacion ? new Date(post.post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible';
          newPost.querySelector('.post-author').textContent = post.post.propietarioNombre || 'Autor no disponible';
  
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
  
          // Asignar datos de favoritos, comentarios y visitas
          newPost.querySelector('.post-votes').textContent = `${post.post.conteo_favoritos || 0} Favoritos`;
          newPost.querySelector('.post-replies').textContent = `${post.post.recuento_comentarios || 0} Comentarios`;
          newPost.querySelector('.post-views').textContent = `${post.post.conteo_visitas || 0} Visitas`;
  
          postContainer.appendChild(newPost);
        });
      })
      .catch(error => {
        console.error('Error al obtener los posts:', error);
      });
  });
  