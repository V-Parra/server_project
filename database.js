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


function gameCreated(data) {
    var sql = `INSERT INTO games (idGame) VALUE ("${data}")`;
    db.query(sql, function (err, res) {
        if (err) throw err;
    })
}

function createAccount(data) {
    var sql = `INSERT INTO user (username) VALUES ("${data}")`;
    db.query(sql, function (err, res) {
        if (err) throw err;
    })
}

module.exports = { db , createAccount, gameCreated }