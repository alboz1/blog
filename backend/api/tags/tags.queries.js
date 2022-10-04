const mysql = require('../../lib/mysql');

async function get(columns, condition) {
    const [ tags ] = await mysql().join('tags', 'blog_posts', 'tags.blog_id', 'blog_posts.id').where(condition).select(columns);

    return tags;
}

module.exports = {
    get
};