const express = require('express');
const app = express();
const port = 8080;
var index = require('./routes/index');
var db = require('./database');
var bodyParser = require('body-parser')

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

//add the router
app.use('/', index);
app.listen(process.env.port || port);

console.log('Running at Port ' + port);