const mysql = require('../../lib/mysql');

async function create(blogPost, slug, array) {
    const [ post ] = await mysql().insertInto('blog_posts', blogPost);
    const newSlug = `${slug}-${post.insertId}`;
    const _slug = mysql().insertInto('slugs', [ newSlug ]);
    const tags = array.length ? mysql().insertInto('tags', array, post.insertId) : Promise.resolve();
    const result = await Promise.all([post, _slug, tags]);
    
    return result;
}

async function update(columns, postID, slug, tags, condition) {
    const [ post ] = await mysql().where(condition).update('blog_posts', columns);

    if (post.affectedRows === 0) {
        return post;
    }

    const newSlug = `${slug}-${postID}`;
    const _slug = mysql().where({blog_id: postID}).update('slugs', { name: newSlug });
    const deleteTags = mysql().from('tags').where({ blog_id: postID }).delete();
    const _tags = tags.length ? mysql().insertInto('tags', tags, postID) : Promise.resolve();
    const result = await Promise.all([post, _slug, deleteTags, _tags]);

    return result;
}

async function publish(condition) {
    const [ post ] = await mysql().where(condition).update('blog_posts', { published: true });
    
    return post;
}

async function private(condition) {
    const [ post ] = await mysql().where(condition).update('blog_posts', { published: false });

    return post;
}

async function deletePost(condition) {
    const [ post ] = await mysql().from('blog_posts').where(condition).delete();

    return post;
}

async function get(condition, columns, offset = 0) {
    const [ post ] = await mysql().join('slugs', 'blog_posts', 'slugs.blog_id', 'blog_posts.id')
                        .join('blog_posts', 'users', 'blog_posts.author_id', 'users.id')
                        .where(condition)
                        .limit(offset, 10)
                        .select(columns);

    if (post.length === 0) {
        return [];
    }

    return post;
}

async function getWithTags(slug) {
    const [ result ] = await mysql().join('slugs', 'blog_posts', 'slugs.blog_id', 'blog_posts.id')
                    .join('blog_posts', 'users', 'blog_posts.author_id', 'users.id')
                    .join('blog_posts', 'tags', 'blog_posts.id', 'tags.blog_id')
                    .where({
                        ['slugs.name']: slug,
                        ['blog_posts.published']: true
                    })
                    .select(['blog_posts.id', 'blog_posts.title', 'blog_posts.body', 'blog_posts.img_header', 'users.username AS author', 'blog_posts.created_at','blog_posts.updated_at', 'tags.name']);
    
    if (result.length === 0) {
        return [];
    }

    const post = {
        id: result[0].id,
        title: result[0].title,
        body: result[0].body,
        img_header: result[0].img_header,
        author: result[0].author,
        created_at: result[0].created_at,
        updated_at: result[0].updated_at
    }
    const tags = result.map(p => p.name);
    post.tags = tags;

    return post;
    
}

async function getOne(condition) {
    const [ post ] = await mysql().from('blog_posts').where(condition).select('*');

    return post;
}

module.exports = {
    create,
    update,
    publish,
    private,
    deletePost,
    get,
    getOne,
    getWithTags
};