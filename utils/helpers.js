module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  eq: (a, b) => {
    // Compare two data variables
    return a === b;
  },
  has_comments: (blogId, comments) => {
    // Check to see if comments exsist
    return comments.some(comment => comment.blog_id === blogId);
  }
};