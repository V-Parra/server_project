var mydb = require('mysql');
var db = mydb.createConnection({
    host: "localhost",
    user: "root", 
    password: "",
    database: "mydb"
});

db.connect(function (err) {
    if (err) throw err;
    console.log('Connectec to mydb');
})


function createAccount(data) {
    var sql = `INSERT INTO user (username) VALUES ("${data}")`;
    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log('Account Created');
    })
}

function querySelectByForm(data) {
    var sql = `SELECT * FROM user WHERE username = ("${data}")`;
    db.query(sql, function (err, res) {
        if (err) throw err;
        console.log(res);
    });
}
module.exports = { db, querySelectByForm, createAccount }