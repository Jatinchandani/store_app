const mysql = require('mysql2');
const util = require("util");

const connection =mysql.createPool({
    host:"localhost",
    user:"root" ,
    port: '3306',
    password :"" ,
    database: "store",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;