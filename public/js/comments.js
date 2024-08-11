// Handles the creation of a new comment using SweetAlert forms
const newCommentHandler = async (blogId, userId) => {
  // Prompt user for a new comment
  const { value: text } = await Swal.fire({
    input: 'textarea',
    inputLabel: 'Please Leave a Comment',
    inputPlaceholder: 'Type your comment here...',
    showCancelButton: true,
    customClass: {
      inputLabel: 'swal-title',
      input: 'swal-input',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    },
    preConfirm: (text) => {
      if (!text) {
        Swal.showValidationMessage('You need to write something!')
      } else {
        return text;
      }
    }
  });
  
  // Submit the new comment if text is provided
  if (text) {
      try {
          const response = await fetch('/api/comments', {
              method: 'POST',
              body: JSON.stringify({ content: text, blog_id: blogId, user_id: userId }),
              headers: { 'Content-Type': 'application/json' }
          });
          
          if (response.ok) {
            Swal.fire({
              position: 'middle',
              icon: 'success',
              title: 'Your comment has been added',
              showConfirmButton: false,
              timer: 1200
            }).then(() => {
              document.location.replace(`/`);
            });
          } else {
            throw new Error('Failed to create comment');
          }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Okay',
          customClass: { confirmButton: 'swal-confirm-btn' }
        });
      }
  }
};


// Open the new comment form when the '+Comment' button is clicked
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('add-comment-btn')) {
    if (isLoggedIn) {
    const blogId = event.target.getAttribute('data-id');
    const userId = event.target.getAttribute('data-user-id');
    newCommentHandler(blogId, userId);
    } else {
      // Redirect to login if user is not logged in
      document.location.replace('/login');
    }
  }
});