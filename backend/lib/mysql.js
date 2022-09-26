const connection = require('../config/db');

const db = connection.promise();

class Mysql {
    sql = '';

    async select(columns) {
        this.sql = `SELECT ${columns || '??'} ${this.sql} `;

        return db.query(this.sql, [columns]);
    }

    from(tableName) {
        this.sql += `FROM ${tableName}`;

        return this;
    }

    where(condition) {
        this.sql += ' WHERE ';
        for (const prop in condition) {
            this.sql += `${prop} = ${db.escape(condition[prop])} AND `;
        }
        this.sql = this.sql.substring(0, this.sql.length - 5);

        return this;
    }

    insertInto(tableName, values, lastInsertId) {
        if (Array.isArray(values)) {
            this.sql = `INSERT INTO ${tableName}(name, blog_id) VALUES `;
    
            values.forEach(value => {
                this.sql += `(${db.escape(value)}, ${lastInsertId || 'LAST_INSERT_ID()'}),`;
            });
    
            this.sql = this.sql.substring(0, this.sql.length - 1);
        } else {
            this.sql = `INSERT INTO ${tableName} SET ?`;
        }

        return db.query(this.sql, [values]);
    }

    join(tableName1, tableName2, first, second) {
        if (this.sql.includes(tableName1)) {
            this.sql += ` JOIN ${tableName2} ON ${first} = ${second}`;
        } else {
            this.sql += `FROM ${tableName1} JOIN ${tableName2} ON ${first} = ${second}`;
        }

        return this;
    }

    update(tableName, values) {
        this.sql = `UPDATE ${tableName} SET ? ${this.sql}`;

        return db.query(this.sql, values);
    }

    delete() {
        this.sql = `DELETE ${this.sql}`;

        return db.query(this.sql);
    }
}

const _mysql = new Mysql();

function mysql() {
    _mysql.sql = '';
    return _mysql;
}

module.exports = mysql;