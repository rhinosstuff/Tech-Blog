const router = require('express').Router();
const { User } = require('../../models');

// Handles new user signup data
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    
    // Check if the error is a validation error
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: err.errors.map(e => e.message).join(', ')
      });
    }

    // Check if the error is a constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Username already exists. Please choose a different username.'
      });
    }

    // Handle other errors
    res.status(500).json({
      message: 'An unexpected error occurred.'
    });
  }
});


// Handles user login data
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });

    // Checks if user exsists 
    if (!userData) {
      return res.status(400).json({
        message: 'Incorrect username or password, please try again.'
      });
    }

    const validPassword = await userData.checkPassword(req.body.password);

    // Checks if password is valid
    if (!validPassword) {
      return res.status(400).json({
        message: 'Incorrect username or password, please try again.'
      });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(500).json({
      message: 'An unexpected error occurred.'
    });
  }
});


// Handles user logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Failed to log out. Please try again.' });
      }

      res.status(204).end();
    });
  } else {
    res.status(404).json({ message: 'No active session found. Please log in first.' });
  }
});

module.exports = router;