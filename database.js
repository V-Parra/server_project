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


function createAccount(dataUsername, dataSocketID, dataInGame, dataEnterAt) {
    var sqlUsername = `INSERT INTO user (username, inGame, socketID, enterAt) VALUES ("${dataUsername}", "${dataInGame}", "${dataSocketID}", "${dataEnterAt}")`;
    db.query(sqlUsername, function (err, res) {
        if (err) throw err;
    })
}

module.exports = { db , createAccount, gameCreated }