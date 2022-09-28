const mysql = require('../../lib/mysql');

async function addComment(comment) {
    const [ result ] = await mysql().insertInto('comments', comment);
    const [ addedComment ] = await mysql().from('comments').where({id: result.insertId}).select('*');

    return addedComment;
}

async function get(id) {
    const [ comments ] = await mysql().from('comments').where({['blog_id']: id}).orderBy('created_at', 'DESC').select('*');

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