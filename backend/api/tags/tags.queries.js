const mysql = require('../../lib/mysql');

async function get(columns, condition) {
    const [ tags ] = condition ?
        await mysql().from('tags').where(condition).select(columns) :
        await mysql().join('tags', 'blog_posts', 'tags.blog_id', 'blog_posts.id').where({['blog_posts.published']: true}).select(columns);

    return tags;
}

module.exports = {
    get
};