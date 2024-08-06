const sequelize = require('../config/connection');
const { User, Blog, Comment } = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // Seed users
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log('--- Users seeded ---');

  // Seed blogs
  const blogs = await Blog.bulkCreate(blogData, {
    individualHooks: true,
    returning: true,
  });
  console.log('--- Blogs seeded ---');

  // Seed comments with predefined user_id and blog_id
  const comments = await Comment.bulkCreate(commentData, {
    individualHooks: true,
    returning: true,
  });
  console.log('--- Comments seeded ---');

  process.exit(0);
};

seedDatabase();