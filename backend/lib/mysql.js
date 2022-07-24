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
    let sql = `DELETE FROM ${tableName} WHERE `;

    for (const prop in condition) {
        sql += `${prop} = ${db.escape(condition[prop])} AND `;
    }
    sql = sql.substring(0, sql.length - 5);

    return db.query(sql);
}

async function join(tableNames, joinON, condition) {
    let sql = `SELECT * FROM ${tableNames[0]}`;

    if (Array.isArray(tableNames)) {
        for (let i = 0; i < tableNames.length - 1; i++) {
            if (i === 1) {
                i++;
            }
            sql += `
                JOIN ${tableNames[i > 1 ? i : i + 1]} ON
                ${tableNames[i]}.${joinON[i]} = ${tableNames[i >= 2 ? i - 1 : i + 1]}.${joinON[i + 1]}
            `;
            if (tableNames.length === 2) {
                break;
            }
        }
        sql += `WHERE ${tableNames[1]}.?`;
    }

    return db.query(sql, condition);
}

module.exports = {
    select,
    insertInto,
    update,
    deleteFrom,
    join
};