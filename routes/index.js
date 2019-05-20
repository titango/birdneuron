var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../index.html'));
  //__dirname : It will resolve to your project folder.
});

module.exports = router;
