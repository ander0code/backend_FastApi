document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.upvote').forEach(button => {
        button.addEventListener('click', () => {
            const voteCount = button.nextElementSibling;
            voteCount.textContent = parseInt(voteCount.textContent) + 1;
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        });
    });

    document.querySelectorAll('.downvote').forEach(button => {
        button.addEventListener('click', () => {
            const voteCount = button.previousElementSibling;
            voteCount.textContent = parseInt(voteCount.textContent) - 1;
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        });
    });

    const commentForm = document.querySelector('.comment-form');
    const addCommentButton = document.getElementById('add-comment');
    addCommentButton.addEventListener('click', () => {
        const commentText = commentForm.querySelector('textarea').value.trim();
        if (commentText !== "") {
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <div class="vote-buttons">
                    <button class="upvote">&uarr;</button>
                    <div class="vote-count">0</div>
                    <button class="downvote">&darr;</button>
                </div>
                <div class="comment-content editable-content" contenteditable="true">
                    <p>${commentText}</p>
                </div>
            `;
            document.querySelector('.comments').insertBefore(newComment, commentForm);

            newComment.querySelector('.upvote').addEventListener('click', () => {
                const voteCount = newComment.querySelector('.vote-count');
                voteCount.textContent = parseInt(voteCount.textContent) + 1;
                newComment.querySelector('.upvote').style.transform = 'scale(1.2)';
                setTimeout(() => {
                    newComment.querySelector('.upvote').style.transform = 'scale(1)';
                }, 200);
            });

            newComment.querySelector('.downvote').addEventListener('click', () => {
                const voteCount = newComment.querySelector('.vote-count');
                voteCount.textContent = parseInt(voteCount.textContent) - 1;
                newComment.querySelector('.downvote').style.transform = 'scale(1.2)';
                setTimeout(() => {
                    newComment.querySelector('.downvote').style.transform = 'scale(1)';
                }, 200);
            });

            commentForm.querySelector('textarea').value = "";
        }
    });
});
