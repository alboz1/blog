const connection = require('../config/db');

const db = connection.promise();

function select(tableName, columns, condition) {
    const sql = `SELECT ${[...columns]} FROM ${tableName} WHERE ?`;

    return db.query(sql, condition);
}

function insertInto(tableName, values) {
    const sql = `INSERT INTO ${tableName}(username, email, password, avatar) VALUES(?)`;

    return db.query(sql, [values]);
}

module.exports = {
    select,
    insertInto
};