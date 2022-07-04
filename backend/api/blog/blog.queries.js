const mysql = require('../../lib/mysql');

async function create(post) {
    const result = await mysql.insertInto('blog_posts', post);

    return result;
}

module.exports = {
    create
};