function openEditModal() {
    document.getElementById('editModal').style.display = 'block';
  }
  
  function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
  }
  
  function saveChanges() {
    const newPhrase = document.getElementById('editPhrase').value;
    const newDescription = document.getElementById('editDescription').value;
    
    document.getElementById('profile-phrase').textContent = newPhrase;
    document.getElementById('aboutme').textContent = newDescription;
    
    closeEditModal();
  }
  
  // Close the modal if the user clicks outside of it
  window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
  