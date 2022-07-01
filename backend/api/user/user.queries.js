const mysql = require('../../lib/mysql');

async function get(columns, condition) {
    const [ user ] = await mysql.select('users', columns, condition);

    return user;
}

async function signUp(user) {
    const result = await mysql.insertInto('users', Object.values(user));

    return result;
}

module.exports = {
    get,
    signUp
};