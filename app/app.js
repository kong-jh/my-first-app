const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('my first app');
})

var server = app.listen(3000, () => {
    console.log("server listening on port 3000");
});