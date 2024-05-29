document.addEventListener('DOMContentLoaded', function() {
    const voteButtons = document.querySelectorAll('.vote-buttons img');
    
    voteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const rect = button.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            if (clickY < rect.height / 3) {
                alert('Upvote clicked');
            } else if (clickY > 2 * rect.height / 3) {
                alert('Downvote clicked');
            } else {
                alert('Favorite clicked');
            }
        });
    });
});
