document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8000/get_servicios_id/1')
      .then(response => response.json())
      .then(data => {
        const postsWrapper = document.getElementById('posts-wrapper');
        postsWrapper.innerHTML = ''; // Limpiar contenido previo

        data.forEach(review => {
          const post = document.createElement('div');
          post.className = 'post';

          const userInfo = document.createElement('div');
          userInfo.className = 'user-info';

          const userPhoto = document.createElement('img');
          userPhoto.src = 'assets/img/foto-perfil1.webp';
          userPhoto.alt = 'Foto de usuario';
          userPhoto.className = 'user-photo';

          const userDetails = document.createElement('div');
          userDetails.className = 'user-details';

          const userName = document.createElement('div');
          userName.className = 'user-name';
          userName.textContent = 'Usuario ' + review.id_user; // Cambia esto si tienes el nombre del usuario

          const userMeta = document.createElement('div');
          userMeta.className = 'user-meta';

          const reviewDate = document.createElement('span');
          reviewDate.className = 'review-date';
          reviewDate.textContent = new Date(review.fecha_creacion).toLocaleDateString();

          userMeta.appendChild(reviewDate);
          userDetails.appendChild(userName);
          userDetails.appendChild(userMeta);
          userInfo.appendChild(userPhoto);
          userInfo.appendChild(userDetails);

          const stars = document.createElement('div');
          stars.className = 'stars';
          for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = i < review.calificacion_general ? '★' : '☆';
            stars.appendChild(star);
          }
          userInfo.appendChild(stars);
          post.appendChild(userInfo);

          const comment = document.createElement('div');
          comment.className = 'comment';

          const commentText = document.createElement('p');
          commentText.className = 'comment-text';
          commentText.textContent = review.resena;

          comment.appendChild(commentText);
          post.appendChild(comment);

          const detailsWrapper = document.createElement('div');
          detailsWrapper.className = 'details-wrapper collapsed';

          const ratingDetails = document.createElement('div');
          ratingDetails.className = 'rating-details';

          const ratingService = document.createElement('div');
          ratingService.innerHTML = `<span class="rating-label">Servicio:</span> ${review.calificacion_1}`;

          const ratingFacilities = document.createElement('div');
          ratingFacilities.innerHTML = `<span class="rating-label">Facilidades:</span> ${review.calificacion_2}`;

          const ratingOrientation = document.createElement('div');
          ratingOrientation.innerHTML = `<span class="rating-label">Orientacion:</span> ${review.calificacion_3}`;

          ratingDetails.appendChild(ratingService);
          ratingDetails.appendChild(ratingFacilities);
          ratingDetails.appendChild(ratingOrientation);
          detailsWrapper.appendChild(ratingDetails);
          post.appendChild(detailsWrapper);

          const toggleButton = document.createElement('button');
          toggleButton.className = 'toggle-button';
          toggleButton.textContent = 'Ver más';
          toggleButton.addEventListener('click', () => {
            detailsWrapper.classList.toggle('collapsed');
            toggleButton.textContent = detailsWrapper.classList.contains('collapsed') ? 'Ver más' : 'Ver menos';
          });
          post.appendChild(toggleButton);

          postsWrapper.appendChild(post);
        });
      })
      .catch(error => console.error('Error al obtener las calificaciones:', error));
  });