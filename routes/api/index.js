const router = require('express').Router();
const { User, Post } = require('../../models');
const userRoutes = require('./user-routes.js');
// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});
Post.belongsTo(User, {
    foreignKey: 'user_id',
});
router.use('/users', userRoutes);

module.exports = router;