const express = require('express');
const checkAuth = require('../../middleware/checkAuth');
const { addComment } = require('./comments.queries');

const router = express.Router();

router.post('/', checkAuth, async (req, res, next) => {
    const { body, postId } = req.body;
    try {
        const result = await addComment({
            body: body,
            blog_id: postId,
            author_id: req.session.user.id
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;