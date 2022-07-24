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

async function get(slug) {
    const [ result ] = await mysql.select('slugs', ['*'], {name: slug});
    const [ post ] = await mysql.join(['slugs', 'blog_posts', 'users'], ['blog_id', 'id', 'id', 'author_id'], {published: true});

    if (result.length === 0 || post.length === 0) {
        return [];
    }

    const blogPost = {
        id: post[0].id,
        title: post[0].title,
        body: post[0].body,
        img_header: post[0].img_header,
        author: post[0].username,
        created_at: post[0].created_at,
        updated_at: post[0].updated_at
    }

    return blogPost;
}

module.exports = {
    create,
    update,
    publish,
    private,
    deletePost,
    get
};