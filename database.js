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

module.exports = { db }