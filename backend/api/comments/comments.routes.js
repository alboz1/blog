const express = require('express');
const commentSchema = require('./comments.schema');
const checkAuth = require('../../middleware/checkAuth');
const query = require('./comments.queries');
const isPostOwner = require('../../middleware/isPostOwner');

const router = express.Router();

router.post('/', checkAuth, async (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        res.status(400);
        return next(error);
    }

    const { body, postId } = req.body;
    try {
        const result = await query.addComment({
            body: body,
            blog_id: postId,
            author_id: req.session.user.id
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const comments = await query.get(req.params.id);

        res.json(comments);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', checkAuth, async (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        res.status(400);
        return next(error);
    }

    try {
        const result = await query.edit({id: req.params.id, author_id: req.session.user.id}, req.body);

        if (result.affectedRows === 0 || result.changedRows === 0) {
            res.status(400);
            throw new Error('Something went wrong! Could\'nt edit comment.');
        }

        res.json({message: 'Comment saved.'});
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', checkAuth, isPostOwner, async (req, res, next) => {
    try {
        const result = await query.deleteComment(res.locals.isPostOwner ? {id: req.params.id} : {id: req.params.id, author_id: req.session.user.id});
        
        if (result.affectedRows === 0) {
            res.status(400);
            throw new Error('Something went wrong! Could\'nt delete comment.');
        }

        res.json({message: 'Comment deleted.'});
    } catch (error) {
        next(error);
    }
});

module.exports = router;