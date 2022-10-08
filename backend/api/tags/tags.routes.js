const express = require('express');
const query = require('./tags.queries');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const tags = await query.getAll();
        const uniqueTags = [... new Set(tags.map(tag => tag.name))];
        
        res.json(uniqueTags);
    } catch (error) {
        next(error);
    }
});

router.get('/:tag', async (req, res, next) => {
    try {
        const posts = await query.get(['blog_posts.title', 'slugs.name AS slug'], {
            ['tags.name']: req.params.tag,
            ['blog_posts.published']: true
        });
        
        res.json(posts);
    } catch (error) {
        next(error);
    }
});

module.exports = router;