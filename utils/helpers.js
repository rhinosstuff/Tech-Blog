module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  eq: (a, b) => {
    return a === b;
  },
  has_comments: (blogId, comments) => {
    return comments.some(comment => comment.blog_id === blogId);
  }
};
