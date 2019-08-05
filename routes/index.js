var express = require('express');
var mongoose = require('mongoose');
const path = require('path');
var birdRoute = require('./birdchart');


var router = express.Router();

//return the home page
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/index.html'));
});

//return the document page
router.get('/document',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/document.html'));
});

//return the usage page
router.get('/usage',function(req,res){
  res.sendFile(path.join(__dirname+'/../views/usage.html'));
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

router.get("/download", function(req, res, next){

});

//BIRD CHART API
router.get('/birdchart/get',birdRoute.getAll);
router.post('/birdchart/upload',birdRoute.uploadData);

module.exports = router;
