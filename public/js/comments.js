// fetch request to add a comment
const newCommentHandler = async (blogId, userId) => {
  const { value: text } = await Swal.fire({
    input: "textarea",
    inputLabel: "Please Leave a Comment",
    inputPlaceholder: "Type your comment here...",
    inputAttributes: {
      "aria-label": "Type your comment here"
    },
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

  const comment = text
  
  if (comment) {
      try {
          const response = await fetch('/api/comments', {
              method: 'POST',
              body: JSON.stringify({ content: comment, blog_id: blogId, user_id: userId }),
              headers: { 'Content-Type': 'application/json', },
          });
          
          if (response.ok) {
            Swal.fire({
              position: "middle",
              icon: "success",
              title: "Your comment has been added",
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              document.location.replace(`/`);
            });
          } else {
              console.error("there's been an error");
          }
      } catch (error) {
          console.error(error.message);
      }
  }
};

// listens on add comment button, gets blog and user id to send for post request 
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('add-comment-btn')) {
    const blogId = event.target.getAttribute('data-id');
    const userId = event.target.getAttribute('data-user-id');
    newCommentHandler(blogId, userId);
  }
});