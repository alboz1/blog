const connection = require('../config/db');

const db = connection.promise();

function select(tableName, columns, condition) {
    const sql = `SELECT ${[...columns]} FROM ${tableName} WHERE ?`;

    return db.query(sql, condition);
}

function insertInto(tableName, values, lastInsertId) {
    let sql = '';

    if (Array.isArray(values)) {
        sql = `INSERT INTO ${tableName}(name, blog_id) VALUES `;

        values.forEach(value => {
            sql += `(${db.escape(value)}, ${lastInsertId || 'LAST_INSERT_ID()'}),`;
        });

        sql = sql.substring(0, sql.length - 1);
    } else {
        sql = `INSERT INTO ${tableName} SET ?`;
    }

    return db.query(sql, [values]);
}

function update(tableName, values, condition) {
    let sql = `UPDATE ${tableName} SET ? WHERE `;

    for (const prop in condition) {
        sql += `${prop} = ${db.escape(condition[prop])} AND `;
    }
    sql = sql.substring(0, sql.length - 5);

    return db.query(sql, values);
}

async function deleteFrom(tableName, condition) {
    const sql = `DELETE FROM ${tableName} WHERE ?`;

    return db.query(sql, condition);
}

module.exports = {
    select,
    insertInto,
    update,
    deleteFrom
};