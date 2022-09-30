const mysql = require('../../lib/mysql');

async function addComment(comment) {
    const [ result ] = await mysql().insertInto('comments', comment);
    const [ addedComment ] = await mysql().join('comments', 'users', 'comments.author_id', 'users.id')
                                        .where({['comments.id']: result.insertId})
                                        .select(['comments.id', 'comments.body', 'comments.blog_id', 'users.username AS author', 'comments.created_at', 'comments.updated_at']);
    return addedComment;
}

async function get(id) {
    const [ comments ] = await mysql().join('comments', 'users', 'comments.author_id', 'users.id')
                                    .where({blog_id: id})
                                    .orderBy('created_at', 'DESC')
                                    .select(['comments.id', 'comments.body', 'comments.blog_id', 'users.username AS author', 'comments.created_at', 'comments.updated_at']);
    return comments;
}

async function edit(condition, columns) {
    const [ result ] = await mysql().where(condition).update('comments', columns);

    return result;
}

async function deleteComment(condition) {
    const [ result ] = await mysql().from('comments').where(condition).delete();

    return result;
}

module.exports = {
    addComment,
    get,
    edit,
    deleteComment
};