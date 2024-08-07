const toggleViewBlog = (blogId) => {
  // toggle corresponding comment div by data attribute that matches id
  const blogContent = document.querySelector(`.blog-content[data-id="${blogId}"]`);
  const comments = document.querySelector(`.comment-container[data-id="${blogId}"]`);
  
  if (blogContent) {
    blogContent.classList.toggle('d-none');
  }

  if (comments) {
    comments.classList.toggle('d-none');
  }
};

// fetch request to add a comment
const newCommentHandler = async (blogId, userId) => {
  const { value: text } = await Swal.fire({
    input: "textarea",
    inputLabel: "Please Leave a Comment",
    inputPlaceholder: "Type your comment here...",
    inputAttributes: {
      "aria-label": "Type your comment here"
    },
    showCancelButton: true
  });

  const comment = text
  // const comment = document.querySelector(`#comment-${blogId}`).value.trim();
  if (comment) {
      try {
          const response = await fetch('/api/comments', {
              method: 'POST',
              body: JSON.stringify({ content: comment, blog_id: blogId, user_id: userId }),
              headers: { 'Content-Type': 'application/json', },
          });
          
          if (response.ok) {
              document.location.replace(`/`);
          } else {
              console.error("there's been an error");
          }
      } catch (error) {
          console.error(error.message);
      }
  }
};

// listen for a click inside a .blog-card element and get the data-id of the blog
document.addEventListener('click', function(event) {
  const blogCard = event.target.closest('.blog-card');
  if (blogCard) {
    if (isLoggedIn) {
      const blogId = blogCard.getAttribute('data-id');
      toggleViewBlog(blogId);
    } else {
      document.location.replace('/login');
    }
  }
});

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('add-comment')) {
    const blogId = event.target.getAttribute('data-id');
    const userId = event.target.getAttribute('data-user-id');
    newCommentHandler(blogId, userId);
  }
});