module.exports = function (mongoose, models){
	var express = require("express");
	
	var api = express.Router();
	
	var User = models.User;
	var File = models.File;
	
	api.get('/authenticate/:username/password', function(req, res){
		User.findOne({username : req.params.username}, function(err, user){
			if(user){
				if(user.password == req.params.password){
					res.status(200).send(user);
				}
			}
		});
		res.status(200).send(false);
	});
	api.get('/images', function(req, res){
		File.find({}).populate('event').exec(function(err, files){
			res.status(200).send(files);
		});
	});
	
	return api;
};