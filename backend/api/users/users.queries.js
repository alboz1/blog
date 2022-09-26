const mysql = require('../../lib/mysql');

async function get(columns, condition) {
    const [ user ] = await mysql().from('users').where(condition).select(columns);
    return user;
}

async function update(columns, condition) {
    const [ user ] = await mysql().where(condition).update('users', columns);

    return user;
}

module.exports = {
    get,
    update
};