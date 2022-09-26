const express = require('express');
const query = require('./tags.queries');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const tags = await query.get('name');
        const uniqueTags = [... new Set(tags.map(tag => tag.name))];
        
        res.json(uniqueTags);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const tags = await query.get('name', { blog_id: req.params.id });
        const postTags = tags.map(tag => tag.name);

        res.json(postTags);
    } catch (error) {
        next(error);
    }
});

module.exports = router;