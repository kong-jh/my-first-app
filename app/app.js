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

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    var sql = 'INSERT INTO word (title, mean) VALUES(?, ?)';
    var title = req.body.title;
    var mean = req.body.mean;
    conn.query(sql, [title, mean], function(err, result) {
        if(err) {
            console.log(err);
            res.status(500).send('error');
        } else {
            res.redirect('/'+result.insertId);
        }
    });
});

app.get('/:id/edit', (req, res) => {
    var id = req.params.id;
    var sql = 'SELECT id, title, mean FROM word WHERE id=?';
    conn.query(sql, [id], function(err, word){
        if(err) {
            console.log(err);
            res.status(500).send('error');
        } else {
            res.render('edit', {word:word[0]});
        }
    });
});

app.post('/:id/edit', (req, res) => {
    var id = req.params.id;
    var title = req.body.title;
    var mean = req.body.mean;
    var sql = 'UPDATE word SET title=?, mean=? WHERE id=?';
    conn.query(sql, [title, mean, id], function(err, result) {
        if(err) {
            console.log(err);
            res.status(500).send('error');
        } else {
            res.redirect('/'+id);
        }
    });
});

app.get(['/', '/:id'], (req, res) => {
    var sql = 'SELECT id, title, mean FROM word';
    conn.query(sql, function(err, words){
        if(err) {
            console.log(err);
            res.status(500).send('error');
        }
        var id = req.params.id;
        if(id) {
            var sql = 'SELECT * FROM word WHERE id=?';
            conn.query(sql, [id], function(err, word){
                if(err) {
                    console.log(err);
                    res.status(500).send('error');
                } else {
                    res.render('view', {words:words, word:word[0]});
                }
            });
        } else {
            res.render('view', {words:words});
        }
    })
});

app.post('/search', (req, res) => {
    var title = req.body.title;
    var sql = 'SELECT * FROM word WHERE title=?';
    conn.query(sql, [title], function(err, words) {
        if(err) {
            console.log(err);
            res.status(500).send('error');
        } else {
            res.render('view', {words:words});
        }
    });
});

var server = app.listen(3001, () => {
    console.log("server listening on port 3001");
});