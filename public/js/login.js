// Toggle the display of login or signup form 
const toggleFormDisplay = () => {
  // Get login or signup element 
  const loginForm = document.querySelector('.login-form');
  const signupForm = document.querySelector('.signup-form');

  // Toggle visibility of login and signup form
  if (loginForm && signupForm) {
    loginForm.classList.toggle('d-none');
    signupForm.classList.toggle('d-none');
  }
};


// Handles the login of the user
const loginHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const username = document.querySelector('#username-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  // Submit the user info if username and password are provided
  if (username && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      // If successful, redirect the browser to the dashboard page
      document.location.replace('/dashboard?login=success');
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Incorrect username or password. Please try again',
        icon: 'error',
        confirmButtonText: 'Please Try Again',
        customClass: {
          inputLabel: 'swal-title',
          input: 'swal-input',
          confirmButton: 'swal-confirm-btn'
        }
      })
    }
  }
};


// Handles the signup of a new user
const signupHandler = async (event) => {
  event.preventDefault();

  // Collect values from the signup form
  const username = document.querySelector('#username-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  // Client-side validation for password length
  if (password.length < 8) {
    return Swal.fire({
      title: 'Error!',
      text: 'Password must be at least 8 characters long.',
      icon: 'error',
      confirmButtonText: 'Try Again',
      customClass: {
        inputLabel: 'swal-title',
        input: 'swal-input',
        confirmButton: 'swal-confirm-btn'
      }
    });
  }

  // Submit the new user info if username and password are provided
  if (username && password) {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // If successful, redirect the browser to the dashboard page with parameter
        document.location.replace('/dashboard?login=success');
      } else {
        // Handle server-side validation errors
        const errorData = await response.json();
        Swal.fire({
          title: 'Error!',
          text: errorData.message || response.statusText,
          icon: 'error',
          confirmButtonText: 'Please Try Again',
          customClass: {
            inputLabel: 'swal-title',
            input: 'swal-input',
            confirmButton: 'swal-confirm-btn'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Okay',
        customClass: {
          inputLabel: 'swal-title',
          input: 'swal-input',
          confirmButton: 'swal-confirm-btn'
        }
      });
    }
  }
};


// Check if 'login=success' is present in the URL
document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('login') === 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Signed in successfully"
    });
  }
});


// Check if 'logout=success' is present in the URL
document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('logout') === 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Signed out successfully"
    });
  }
});


// Submits user login information
document
  .querySelector('.login-form')?.addEventListener('submit', loginHandler);


// Submits new user signup information 
document
  .querySelector('.signup-form')?.addEventListener('submit', signupHandler);


// Toggles display of login and signup forms
document.querySelectorAll('.switch-form').forEach(switchForm => {
  switchForm.addEventListener('click', toggleFormDisplay);
});