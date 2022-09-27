const mysql = require('../../lib/mysql');

async function addComment(comment) {
    const [ result ] = await mysql().insertInto('comments', comment);
    const [ addedComment ] = await mysql().from('comments').where({id: result.insertId}).select('*');

    return addedComment;
}

module.exports = {
    addComment
};