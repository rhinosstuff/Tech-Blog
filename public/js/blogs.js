const toggleBlogDisplay = (blogId) => {
  // toggle corresponding comment div by data attribute that matches id
  const blogContent = document.querySelector(`.blog-content[data-id="${blogId}"]`);
  const btnOptions = document.querySelector(`.blog-btn-options[data-id="${blogId}"]`);
  
  if (blogContent) {
    blogContent.classList.toggle('d-none');
  }

  if (btnOptions) {
    btnOptions.classList.toggle('d-none');
  }
};

const toggleCommentsDisplay = (blogId) => {
  // toggle corresponding comment div by data attribute that matches id
  const comments = document.querySelector(`.comment-container[data-id="${blogId}"]`);

  if (comments) {
    console.log(comments)
    comments.classList.toggle('d-none');
  }
};

const newBlogHandler = async () => {
  const { value: formValues } = await Swal.fire({
    title: "New Blog",
    html: `
      <input id="swal-title" class="swal2-input swal-input" placeholder="Blog Title">
      <textarea id="swal-content" class="swal2-textarea swal-input" placeholder="Blog Content"></textarea>
    `,
    focusConfirm: false,
    showCancelButton: true,
    customClass: {
      input: 'swal-input',
      confirmButton: 'swal-confirm-btn'
    },
    preConfirm: () => {
      const title = document.getElementById("swal-title").value;
      const content = document.getElementById("swal-content").value;
      if (!title || !content) {
        Swal.showValidationMessage('You need to fill out both fields!');
        return false;
      }
      return [title, content];
    }
  });

  if (formValues) {
    const [title, content] = formValues;
    try {
      const response = await fetch(`/api/blogs`, {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        throw new Error('Failed to create blog');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Okay'
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
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/blogs/${blogId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire(
            'Deleted!',
            'Your blog has been deleted.',
            'success'
          ).then(() => {
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
          confirmButtonText: 'Okay'
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

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('view-comments-btn')) {
    const blogId = event.target.getAttribute('data-id');
    toggleCommentsDisplay(blogId);
  }
});

document
  .querySelector('.add-blog-btn')?.addEventListener('click', newBlogHandler);

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('del-blog-btn')) {
    const blogId = event.target.getAttribute('data-id');
    delBlogHandler(blogId);
  }
});
