document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carrera-option').forEach(option => {
      option.addEventListener('click', function(event) {
        event.preventDefault();
        const value = this.getAttribute('data-value');
        const url = `http://127.0.0.1:8000/posts/${value}`;
  
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('No se pudo obtener los posts');
            }
            return response.json();
          })
          .then(posts => {
            const postContainer = document.getElementById('post-container');
            const postTemplate = document.getElementById('post-template');
  
            if (!Array.isArray(posts)) {
              throw new Error('La respuesta no es un array');
            }
  
            // Limpiar el contenedor de posts antes de agregar nuevos posts
            postContainer.innerHTML = '';
  
            posts.forEach(post => {
              const newPost = postTemplate.cloneNode(true);
              newPost.removeAttribute('id'); // Eliminar el ID para evitar duplicados
              newPost.style.display = ''; // Remover el display none para que sea visible
  
              // Asignar los valores a los elementos del post
              newPost.querySelector('.post-title').textContent = post.titulo || 'Título no disponible';
              newPost.querySelector('.post-title').href = './text.html'; // Esto debería actualizarse si el link debe variar por post
              newPost.querySelector('.post-date').textContent = post.fecha_Creacion ? new Date(post.fecha_Creacion).toLocaleDateString() : 'Fecha no disponible';
              newPost.querySelector('.post-author').textContent = post.propietarioNombre || 'Autor no disponible';
  
              // Etiquetas
              const tagsContainer = newPost.querySelector('.post-tags');
              tagsContainer.innerHTML = ''; // Limpia previos tags
              (post.etiquetas || []).forEach(tag => {
                const tagLink = document.createElement('a');
                tagLink.href = '#';
                tagLink.className = 'text-black mr-2';
                tagLink.textContent = tag;
                tagsContainer.appendChild(tagLink);
              });
  
              // Asignar datos de favoritos, comentarios y visitas
              newPost.querySelector('.post-votes').textContent = `${post.conteo_favoritos || 0} Favoritos`;
              newPost.querySelector('.post-replies').textContent = `${post.recuento_comentarios || 0} Comentarios`;
              newPost.querySelector('.post-views').textContent = `${post.conteo_visitas || 0} Visitas`;
  
              postContainer.appendChild(newPost);
            });
  
            // Eliminar la plantilla original después de usarla
            postTemplate.remove();
          })
          .catch(error => {
            console.error('Error al obtener los posts:', error);
            // Podrías agregar aquí código para mostrar un mensaje al usuario, etc.
          });
      });
    });
  });
  