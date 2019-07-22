var mongoose = require('mongoose');
var BirdChartModel = require('../model/birdchart')

exports.getAll = function(req, res, next)
{
	BirdChartModel.find({}, function(err, birdcharts){
		if(err) return next(err);
		console.log(birdcharts);
		res.jsonp({data: birdcharts});
	});
}

exports.uploadData = function(req, res, next)
{
	console.log("req.body: ", req.body);
	if(typeof req.body.data != 'undefined')
	{
		var uploaded = req.body.data;

		var newmodel = new BirdChartModel({
			topScore: uploaded.topScore,
			data: uploaded.data
		});

		newmodel.save(function(err, prod){
			if(err) return next(err);
			res.jsonp(prod);
		});
	}
}