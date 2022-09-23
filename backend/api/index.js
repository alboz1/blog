const express = require('express');

const userRoutes = require('./user/user.routes');
const blogRoutes = require('./blog/blog.routes');
const authRoutes = require('./auth/auth.routes');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API'
    });
});

router.use('/user', userRoutes);
router.use('/blog', blogRoutes);
router.use('/auth', authRoutes);

module.exports = router;