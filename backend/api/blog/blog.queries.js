const mysql = require('../../lib/mysql');

async function create(blogPost, slug, array) {
    const post = await mysql.insertInto('blog_posts', blogPost);
    const blogSlug = `${slug}-${post[0].insertId}`;
    const _slug = mysql.insertInto('slugs', [blogSlug]);
    const tags = array.length ? mysql.insertInto('tags', array) : Promise.resolve();
    const result = await Promise.all([post, _slug, tags]);
    
    return result;
}

module.exports = {
    create
};