// Toggles the display of corresponding blog elements by data attribute that matches blogId
const toggleBlogDisplay = (blogId) => {
  // Get the blog content, button options, and comments elements based on blogId
  const blogContent = document.querySelector(`.blog-content[data-id='${blogId}']`);
  const btnOptions = document.querySelector(`.blog-btn-options[data-id='${blogId}']`);
  const comments = document.querySelector(`.comment-container[data-id='${blogId}']`);
  
  // Toggle visibility of blog content and button options
  if (blogContent) blogContent.classList.toggle('d-none');
  if (btnOptions) btnOptions.classList.toggle('d-none');

  // Only hide comments if they are currently visible
  if (comments && !comments.classList.contains('d-none')) {
    comments.classList.toggle('d-none');
  }
};


// Toggles the display of the comment section corresponding to the blogId
const toggleCommentsDisplay = (blogId) => {
  const comments = document.querySelector(`.comment-container[data-id='${blogId}']`);
  if (comments) comments.classList.toggle('d-none');
};


// Handles the creation of a new blog using SweetAlert forms
const newBlogHandler = async () => {
  // Prompt user for a new blog title
  const { value: title } = await Swal.fire({
    input: 'text',
    inputLabel: 'New Blog Title',
    inputPlaceholder: 'Blog Title...',
    showCancelButton: true,
    customClass: {
      inputLabel: 'swal-title',
      input: 'swal-input',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    },
    preConfirm: (title) => {
      if (!title) {
        Swal.showValidationMessage('You need to write something!')
      } else {
        return title;
      }
    }
  });

  // Ensure title is provided before asking for blog content
  if (title) {
    const { value: content } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'New Blog Content',
      inputPlaceholder: 'Blog Content...',
      showCancelButton: true,
      animation: false,
      customClass: {
        inputLabel: 'swal-title',
        input: 'swal-input',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      },
      preConfirm: (content) => {
        if (!content) {
          Swal.showValidationMessage('You need to write something!')
        } else {
          return content;
        }
      }
    });
  
    // Submit the new blog if both title and content are provided
    if (content) {
      try {
        const response = await fetch(`/api/blogs`, {
          method: 'POST',
          body: JSON.stringify({ title, content }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          Swal.fire({
            position: 'middle',
            icon: 'success',
            title: 'Your blog has been added',
            showConfirmButton: false,
            timer: 1200
          }).then(() => {
            document.location.replace('/dashboard');
          });
        } else {
          throw new Error('Failed to create blog');
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
  }
};


// Handles editing a blog by blogId using SweetAlert forms
const editBlogHandler = async (blogId, blogTitle, blogContent) => {
  // Prompt user to edit blog title
  const { value: title } = await Swal.fire({
    input: 'text',
    inputLabel: 'Edit Blog Title',
    inputPlaceholder: 'Blog Title...',
    inputValue: blogTitle,
    showCancelButton: true,
    customClass: {
      inputLabel: 'swal-title',
      input: 'swal-input',
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    },
    preConfirm: (title) => {
      if (!title) {
        Swal.showValidationMessage('You need to write something!')
      } else {
        return title;
      }
    }
  });
  
  // Ensure title is provided before asking to edit blog content
  if (title) {
    const { value: content } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Edit Blog Content',
      inputPlaceholder: 'Blog Content...',
      inputValue: blogContent,
      showCancelButton: true,
      animation: false,
      customClass: {
        inputLabel: 'swal-title',
        input: 'swal-input',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      },
      preConfirm: (content) => {
        if (!content) {
          Swal.showValidationMessage('You need to write something!')
        } else {
          return content;
        }
      }
    });

    // Submit the edited blog if both title and content are provided
    if (title && content) {
      try {
        const response = await fetch(`/api/blogs/${blogId}`, {
          method: 'PUT',
          body: JSON.stringify({ title, content }),
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          Swal.fire({
            position: 'middle',
            icon: 'success',
            title: 'Your blog has been updated',
            showConfirmButton: false,
            timer: 1200
          }).then(() => {
            document.location.replace('/dashboard');
          });
        } else {
          throw new Error('Failed to update blog');
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
  }
};


// Handles deleting a blog by blogId using SweetAlert modals
const delBlogHandler = async (blogId) => {
  // Prompt user to delete blog
  Swal.fire({
    title: 'Are you sure?',
    text: 'You can not revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    }
  }).then(async (result) => {
    // Submit the blogId to delete if user confirmed
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/blogs/${blogId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire({
            position: 'middle',
            icon: 'success',
            title: 'Your blog has been deleted',
            showConfirmButton: false,
            timer: 1200
          }).then(() => {
            document.location.replace('/dashboard');
          });
        } else {
          throw new Error('Failed to delete blog');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Okay',
          customClass: {
            confirmButton: 'swal-confirm-btn'
          }
        });
      }
    }
  });
};


// Toggle display of blog content and buttons on blog card click
document.addEventListener('click', function(event) {
  const blogCard = event.target.closest('.blog-card');

  // Check if the clicked element is within a blog card
  if (blogCard) {
    // Toggle the display of blog content
    const blogId = blogCard.getAttribute('data-id');
    toggleBlogDisplay(blogId);

    // Toggle the 'active' class on the blog header for visual feedback
    const blogHeader = blogCard.querySelector('.blog-header');
    if (blogHeader) {
      blogHeader.classList.toggle('active');
    }
  }
});


// Toggle display of comments section when 'View Comments' button is clicked
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('view-comments-btn')) {
    const blogId = event.target.getAttribute('data-id');
    toggleCommentsDisplay(blogId);
  }
});


// Open the new blog form when the '+New Blog' button is clicked
document
  .querySelector('.add-blog-btn')?.addEventListener('click', newBlogHandler);


// Open the edit blog form when the 'Edit' button is clicked
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('edit-blog-btn')) {
    const blogId = event.target.getAttribute('data-id');
    const blogTitle = document.getElementById(`blog-title-${blogId}`).textContent;
    const blogContent = document.getElementById(`blog-content-${blogId}`).textContent;
    editBlogHandler(blogId, blogTitle, blogContent);
  }
});


// Open the delete blog confirmation modal when the 'Delete' button is clicked
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('del-blog-btn')) {
    const blogId = event.target.getAttribute('data-id');
    delBlogHandler(blogId);
  }
});