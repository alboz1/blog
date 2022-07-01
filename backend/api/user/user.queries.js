const mysql = require('../../lib/mysql');

async function get(columns, condition) {
    const [ user ] = await mysql.select('users', columns, condition);

    return user;
}

async function signUp(user) {
    const result = await mysql.insertInto('users', Object.values(user));

    return result;
}

async function update(columns, condition) {
    const [ user ] = await mysql.update('users', columns, condition);

    return user;
}

module.exports = {
    get,
    signUp,
    update
};