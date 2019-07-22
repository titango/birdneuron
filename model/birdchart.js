var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var BirdChart = new Schema({
  date: { type: Date, default: Date.now },
  topScore: {type: Number, default: 0},
  data : [{
  	generation: {type: Number, default: 0},
  	time: {type: Number, default: 0}, //Sec
  	score: {type: Number, default: 0}
  }]
});

module.exports = mongoose.model('birdchart', BirdChart );