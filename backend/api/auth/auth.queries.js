const mysql = require('../../lib/mysql');

async function signUp(body) {
    const user = mysql().insertInto('users', body);

    return user;
}

module.exports = {
    signUp
};