const logout = async () => {
  try {
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // Redirect to the homepage after successful logout
      document.location.replace('/');
    } else {
      // Handle specific response codes if needed
      const result = await response.json();
      alert(result.message || 'Failed to log out. Please try again.');
    }
  } catch (error) {
    // Handle network errors or other unexpected issues
    console.error('Error during logout:', error);
    alert('An error occurred during logout. Please try again later.');
  }
};

// Triggers user logout
document.querySelector('#logout').addEventListener('click', logout);