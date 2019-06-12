var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/index.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/about_us',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/about_us.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/header',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/header.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/footer',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/footer.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/demo1',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/demo1.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/demo2',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/demo2.html'));
  //__dirname : It will resolve to your project folder.
});

module.exports = router;
