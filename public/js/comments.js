const toggleComments = (id) => {
  //toggle corresponding comment div by data attribute that matches id
  const comments = document.querySelector(`.comment-container[data-id="${id}"]`);
  if (comments) {
    comments.classList.toggle('d-none');
    comments.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  } 
};

//fetch request to add a comment
const newCommentHandler = async (blogId, userId) => {
  const comment = document.querySelector(`#comment-${blogId}`).value.trim();
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

//listen for a click inside a .blog-card element and get the data-id of the blog
document.addEventListener('click', function(event) {
  const blogCard = event.target.closest('.blog-card');
  if (blogCard) {
    const blogId = blogCard.getAttribute('data-id');
    toggleComments(blogId);
  }
});

// Delegate event listener for the submit comment buttons
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('submit-comment')) {
    const blogId = event.target.getAttribute('data-id');
    const userId = event.target.getAttribute('data-user-id');
    newCommentHandler(blogId, userId);
  }
});