var models = require("../models");

exports.getUsers = function(req, res) {
	models.Users.find().exec(function (err,users) {
		var usernames = [];
		for (var i=0; i<users.length; i++) {
			usernames.push(users[i]["username"]);
		}
		res.json(usernames);
	});
}

exports.validUser = function(req, res) {
	var username = req.params.username;
	models.Users().find({"username":username}).exec(function (err, user) {
		if (user.length) res.json({"result":1});
		else res.json({"result":0});
	});
}