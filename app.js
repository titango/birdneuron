const express = require('express');
const app = express();
var index = require('./routes/index');
app.use(express.static('public'));

//add the router
app.use('/', index);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');