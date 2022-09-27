const express = require('express');

const userRoutes = require('./users/users.routes');
const postRoutes = require('./posts/posts.routes');
const authRoutes = require('./auth/auth.routes');
const tagRoutes = require('./tags/tags.routes');
const commentRoutes = require('./comments/comments.routes');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API'
    });
});

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/tags', tagRoutes);
router.use('/comments', commentRoutes);
router.use('/auth', authRoutes);

module.exports = router;