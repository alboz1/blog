const mysql = require('../../lib/mysql');

async function create(blogPost, slug, array) {
    const [ post ] = await mysql.insertInto('blog_posts', blogPost);
    const newSlug = `${slug}-${post.insertId}`;
    const _slug = mysql.insertInto('slugs', [ newSlug ]);
    const tags = array.length ? mysql.insertInto('tags', array) : Promise.resolve();
    const result = await Promise.all([post, _slug, tags]);
    
    return result;
}

async function update(columns, postID, slug, tags, condition) {
    const [ post ] = await mysql.update('blog_posts', columns, condition);

    if (post.affectedRows === 0) {
        return post;
    }

    const newSlug = `${slug}-${postID}`;
    const _slug = mysql.update('slugs', { name: newSlug }, { blog_id: postID });
    const deleteTags = mysql.deleteFrom('tags', { blog_id: postID });
    const _tags = tags.length ? mysql.insertInto('tags', tags, postID) : Promise.resolve();
    const result = await Promise.all([post, _slug, deleteTags, _tags]);

    return result;
}

async function publish(condition) {
    const [ post ] = await mysql.update('blog_posts', { published: true }, condition);
    
    return post;
}

async function private(condition) {
    const [ post ] = await mysql.update('blog_posts', { published: false }, condition);

    return post;
}

async function deletePost(condition) {
    const [ post ] = await mysql.deleteFrom('blog_posts', condition);

    return post;
}

module.exports = {
    create,
    update,
    publish,
    private,
    deletePost
};