const express = require('express');
const checkAuth = require('../../middleware/checkAuth');
const blogSchema = require('./blog.schema');
const query = require('./blog.queries');
const slugify = require('../../utils/slugify');

const router = express.Router();

router.post('/create', checkAuth, async (req, res, next) => {
    const { error } = blogSchema.validate(req.body);

    if (error) {
        res.status(400);
        return next(error);
    }

    const slug = slugify(req.body.title);
    const blogPost = {
        title: req.body.title,
        body: req.body.body,
        author_id: req.session.user.id,
        img_header: req.body.img_header,
        slug: slug
    };

    try {
        const post = await query.create(blogPost);
        
        res.json({ message: 'Blog post saved.'});
    } catch (error) {
        next(error);
    }
});

module.exports = router;