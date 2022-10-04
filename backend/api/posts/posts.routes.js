const express = require('express');
const checkAuth = require('../../middleware/checkAuth');
const blogSchema = require('./post.schema');
const query = require('./posts.queries');
const slugify = require('../../utils/slugify');

const router = express.Router();

router.post('/', checkAuth, async (req, res, next) => {
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
        img_header: req.body.img_header
    };

    try {
        const post = await query.create(blogPost, slug, req.body.tags);

        res.json({ message: 'Blog post saved.'});
    } catch (error) {
        next(error);
    }
});

router.put('/edit/:id', checkAuth, async (req, res, next) => {
    const slug = slugify(req.body.title);
    const blogPost = {
        title: req.body.title,
        body: req.body.body,
        img_header: req.body.img_header
    };

    try {
        const result = await query.update(blogPost, req.params.id, slug, req.body.tags, {
            id: req.params.id,
            author_id: req.session.user.id
        });

        if (result.affectedRows === 0) {
            res.status(404);
            throw new Error('Something went wrong! Could\'nt update post');
        }

        res.json({
            message: 'Blog post saved.'
        });
    } catch (error) {
        next(error);
    }
});

router.get('/edit/:id', checkAuth, async (req, res, next) => {
    try {
        const post = await query.getOne({id: req.params.id});

        if (post.length === 0) {
            res.status(404);
            throw new Error('Not found.');
        }

        res.json(post);
    } catch (error) {
        next(error);
    }
});

router.put('/publish/:id', checkAuth, async (req, res, next) => {
    try {
        const result = await query.publish({
            id: req.params.id,
            author_id: req.session.user.id
        });

        if (result.affectedRows === 0) {
            res.status(404);
            throw new Error('Something went wrong! Could\'nt publish post.');
        }
        
        res.json({
            message: 'Blog post published.'
        });
    } catch (error) {
        next(error);
    }
});

router.put('/private/:id', checkAuth, async (req, res, next) => {
    try {
        const result = await query.private({
            id: req.params.id,
            author_id: req.session.user.id
        });

        if (result.affectedRows === 0) {
            res.status(404);
            throw new Error('Something went wrong! Could\'nt unpublish post.');
        }
        
        res.json({
            message: 'Blog post unpublished.'
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', checkAuth, async (req, res, next) => {
    try {
        const result = await query.deletePost({ id: req.params.id, author_id: req.session.user.id });

        if (result.affectedRows === 0) {
            res.status(404);
            throw new Error('Something went wrong! Could\'nt delete post.');
        }

        res.json({
            message: 'Blog post deleted.'
        });
    } catch (error) {
        next(error);
    }
});

router.get('/dashboard/:offset', checkAuth, async (req, res, next) => {
    try {
        const posts = await query.get(
            {
                ['users.id']: req.session.user.id
            },
            ['blog_posts.id', 'blog_posts.title', 'blog_posts.published'],
            req.params.offset
        );

        res.json(posts);
    } catch (error) {
        next(error);
    }
});

router.get('/:slug', async (req, res, next) => {
    try {
        const post = await query.getWithTags(req.params.slug);

        if (post.length === 0) {
            res.status(404);
            throw new Error('Not found.');
        }

        res.json(post);
    } catch (error) {
        next(error);
    }
});

router.get('/user-posts/:user/:offset', async (req, res, next) => {
    try {
        const posts = await query.get(
            {
                ['users.username']: req.params.user,
                ['blog_posts.published']: true
            },
            ['blog_posts.id', 'blog_posts.title', 'slugs.name AS slug'],
            req.params.offset
        );

        res.json(posts);
    } catch (error) {
        next(error);
    }
});

router.get('/:offset', async (req, res, next) => {
    try {
        const posts = await query.get(
                {['blog_posts.published']: true},
                ['blog_posts.id', 'blog_posts.title', 'blog_posts.created_at', 'blog_posts.updated_at', 'slugs.name AS slug'],
                req.params.offset
            );

        res.json(posts);
    } catch (error) {
        next(error);
    }
});

module.exports = router;