const toggleBlogDisplay = (blogId) => {
  // toggle corresponding blog div by data attribute that matches id
  const blogContent = document.querySelector(`.blog-content[data-id="${blogId}"]`);
  const btnOptions = document.querySelector(`.blog-btn-options[data-id="${blogId}"]`);
  const comments = document.querySelector(`.comment-container[data-id="${blogId}"]`);
  
  if (blogContent) {
    blogContent.classList.toggle('d-none');
  }

  if (btnOptions) {
    btnOptions.classList.toggle('d-none');
  }

  if (comments) {
    if (!comments.classList.contains('d-none')) {
      comments.classList.toggle('d-none');
    }
  }

};

const toggleCommentsDisplay = (blogId) => {
  // toggle corresponding comment div by data attribute that matches id
  const comments = document.querySelector(`.comment-container[data-id="${blogId}"]`);

  if (comments) {
    comments.classList.toggle('d-none');
  }
};

const newBlogHandler = async () => {
  const { value: title } = await Swal.fire({
    input: "text",
    inputLabel: "New Blog Title",
    inputPlaceholder: "Blog Title...",
    inputAttributes: {
      "aria-label": "Blog Title"
    },
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

  let content = '';
  if (title) {
    const { value } = await Swal.fire({
      input: "textarea",
      inputLabel: "New Blog Content",
      inputPlaceholder: "Blog Content...",
      inputAttributes: {
        "aria-label": "Blog Content"
      },
      showCancelButton: true,
      animation: false,
      customClass: {
        inputLabel: 'swal-title',
        input: 'swal-input',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('You need to write something!')
        } else {
          return value;
        }
      }
    })
    content = value;
  }
  
  if (title && content) {
    try {
      const response = await fetch(`/api/blogs`, {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Swal.fire({
          position: "middle",
          icon: "success",
          title: "Your blog has been added",
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
        customClass: {
          confirmButton: 'swal-confirm-btn'
        }
      });
    }
  }
};

const editBlogHandler = async (blogId, blogTitle, blogContent) => {
  const { value: title } = await Swal.fire({
    input: "text",
    inputLabel: "Edit Blog Title",
    inputPlaceholder: "Blog Title...",
    inputValue: blogTitle,
    inputAttributes: {
      "aria-label": "Blog Title"
    },
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

  let content = '';
  if (title) {
    const { value } = await Swal.fire({
      input: "textarea",
      inputLabel: "Edit Blog Content",
      inputPlaceholder: "Blog Content...",
      inputValue: blogContent,
      inputAttributes: {
        "aria-label": "Blog Content"
      },
      showCancelButton: true,
      animation: false,
      customClass: {
        inputLabel: 'swal-title',
        input: 'swal-input',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('You need to write something!')
        } else {
          return value;
        }
      }
    })
    content = value;
  }

  if (title && content) {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Swal.fire({
          position: "middle",
          icon: "success",
          title: "Your blog has been updated",
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
        customClass: {
          confirmButton: 'swal-confirm-btn'
        }
      });
    }
  }
};

const delBlogHandler = async (blogId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/blogs/${blogId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire({
            position: "middle",
            icon: "success",
            title: "Your blog has been deleted",
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

// listens on blog cards, gets the blog id to send for toggling display
document.addEventListener('click', function(event) {
  const blogCard = event.target.closest('.blog-card');
  if (blogCard) {
    if (isLoggedIn) {
      const blogId = blogCard.getAttribute('data-id');
      toggleBlogDisplay(blogId);
    } else {
      document.location.replace('/login');
    }
  }
});

// listens on view-comments-btn, gets the blog id to send for toggling display
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('view-comments-btn')) {
    const blogId = event.target.getAttribute('data-id');
    toggleCommentsDisplay(blogId);
  }
});

// listens on add-blog-btn opens form
document
  .querySelector('.add-blog-btn')?.addEventListener('click', newBlogHandler);

// listens on edit-blog-btn, gets the blog id to send to be edited
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('edit-blog-btn')) {
    const blogId = event.target.getAttribute('data-id');
    const blogTitle = document.getElementById(`blog-title-${blogId}`).textContent;
    const blogContent = document.getElementById(`blog-content-${blogId}`).textContent;
    editBlogHandler(blogId, blogTitle, blogContent);
  }
});

// listens on del-blog-btn, gets the blog id to send to be deleted
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('del-blog-btn')) {
    const blogId = event.target.getAttribute('data-id');
    delBlogHandler(blogId);
  }
});
