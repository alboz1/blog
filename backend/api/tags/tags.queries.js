const mysql = require('../../lib/mysql');

async function get(columns, condition) {
    const [ tags ] = condition ? await mysql().from('tags').where(condition).select(columns) : await mysql().from('tags').select(columns);

    return tags;
}

module.exports = {
    get
};