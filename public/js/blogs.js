const newBlogHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#blog-title').value.trim();
  const content = document.querySelector('#blog-content').value.trim();

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

const delBlogHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    // Show SweetAlert2 confirmation dialog
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
          const response = await fetch(`/api/blogs/${id}`, {
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
  }
};

document
  .querySelector('.new-blog-form')?.addEventListener('submit', newBlogHandler);

document
  .querySelector('.blog-list')?.addEventListener('click', delBlogHandler);
