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
    })
}

function checkPlayerInQueue (data) {
    var sql = `SELECT username FROM user WHERE inQueue = ("${data}")`;
    db.query(sql, function (err, res) {
        if (err) throw err;
        return res;
    });
}
module.exports = { db, checkPlayerInQueue , createAccount }