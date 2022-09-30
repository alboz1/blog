const mysql = require('../lib/mysql');

module.exports = async (req, res, next) => {
    try {
        const [ post ] = await mysql().join('blog_posts', 'comments', 'blog_posts.id', 'comments.blog_id')
                                .join('comments', 'users', 'comments.author_id', 'users.id')
                                .where({
                                    ['comments.id']: req.params.id
                                })
                                .select(['blog_posts.author_id AS author_id']);
    
        if (post.length === 0) {
            res.status(404);
            throw new Error('Something went wrong! Could\'nt delete comment.');
        }
    
        if (post[0].author_id === req.session.user.id) {
            res.locals.isPostOwner = true;
        } else {
            res.locals.isPostOwner = false;
        }
    
        next();
    } catch (error) {
        next(error);
    }
}