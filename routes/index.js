var express = require('express');
const path = require('path');
var router = express.Router();

//return the home page
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/index.html'));
});

//return the about-us page
router.get('/about_us',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/about_us.html'));
});

//return the header section
router.get('/header',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/header.html'));
});

//return the footer section
router.get('/footer',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/footer.html'));
});

//return the first demo page
router.get('/demo1',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/demo1.html'));
});

//return the second demo page
router.get('/demo2',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/demo2.html'));
});

module.exports = router;
