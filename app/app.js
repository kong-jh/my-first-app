const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', 'views');

var mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user:  'user1',
    password:  '12345678',
    database:  'words'
});

conn.connect();

app.get('/', (req, res) => {
    var sql = 'SELECT id, title, mean FROM word';
    conn.query(sql, function(err, words){
        if(err) {
            console.log(err);
            res.status(500).send('error');
        }
        res.render('view', {words:words});
    })
});

var server = app.listen(3001, () => {
    console.log("server listening on port 3001");
});