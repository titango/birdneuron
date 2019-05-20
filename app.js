const express = require('express');
const app = express();
const port = 8080;
var index = require('./routes/index');
app.use(express.static('public'));

//add the router
app.use('/', index);
app.listen(process.env.port || port);

console.log('Running at Port ' + port);