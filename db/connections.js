const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'CYHDmoU8ql41',
        database: 'company'
});

module.exports = db;