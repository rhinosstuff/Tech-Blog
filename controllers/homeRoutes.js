const router = require('express').Router();
const { User, Blog, Comment } = require('../models');
const withAuth = require('../utils/auth');


// Route for homepage
router.get('/', async (req, res) => {
  try {
    // Get all blogs and JOIN with username
    const blogData = await Blog.findAll({
      include: [{ model: User, attributes: ['username', 'id'] }]
    });

    // Get all comments and JOIN with username
    const commentData = await Comment.findAll({
      include: [{ model: User, attributes: ['username', 'id'] }]
    });

    const blogs = blogData.map((blog) => blog.get({ plain: true }));
    const comments = commentData.map((comment) => comment.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogs,
      comments, 
      logged_in: req.session.logged_in,
      pageTitle: 'The Tech Blog' 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// Route for user dashboard. Uses withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }]
    });

    // Get all comments and JOIN with username
    const commentData = await Comment.findAll({
      include: [{ model: User, attributes: ['username'] }]
    });

    const user = userData.get({ plain: true });
    const comments = commentData.map((comment) => comment.get({ plain: true }));

    res.render('dashboard', {
      ...user,
      comments,
      logged_in: true,
      pageTitle: 'Your Dashboard'
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// Route for user login
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to dashboard
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login', {
    pageTitle: 'The Tech Blog'
  });
});

module.exports = router;