const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    database:'chatbot_db',
    user: 'root',
    password: '',

});
connection.connect(function (err) {
    if (err) {
        return console.error('error:' + err.message);
    };
    console.log('connected to the mysql server')
});

module.exports = connection;