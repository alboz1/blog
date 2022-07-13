const connection = require('../config/db');

const db = connection.promise();

function select(tableName, columns, condition) {
    const sql = `SELECT ${[...columns]} FROM ${tableName} WHERE ?`;

    return db.query(sql, condition);
}

function insertInto(tableName, values) {
    let sql = '';

    if (values.length) {
        sql = `INSERT INTO ${tableName}(name, blog_id) VALUES `;

        values.forEach(value => {
            sql += "(" + db.escape(value) + ", LAST_INSERT_ID()" + "),";
        });

        sql = sql.substring(0, sql.length - 1);
    } else {
        sql = `INSERT INTO ${tableName} SET ?`;
    }

    return db.query(sql, [values]);
}

function update(tableName, values, condition) {
    const sql = `UPDATE ${tableName} SET ? WHERE id = ${condition}`;

    return db.query(sql, values);
}

module.exports = {
    select,
    insertInto,
    update
};