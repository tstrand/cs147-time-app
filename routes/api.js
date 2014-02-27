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
	models.Users.find({"username":username}).exec(function (err, user) {
		if (user.length) res.json({"result":1});
		else res.json({"result":0});
	});
}

exports.deleteTask = function(req, res) {
	var id = req.body.id;
	models.Tasks.find({"parent_id":id}).remove(function (err) {
		models.Tasks.find({"_id":id}).remove(function (err) {
			if (err) res.json({"result":0});
			res.json({"result":1});
		});
	});
}

exports.deleteMeeting = function(req, res) {
	var id = req.body.id;
	models.Meetings.find({"_id":id}).remove(function (err) {
		if (err) res.json({"result":0});
		res.json({"result":1});
	});
}

exports.deleteProject = function(req, res) {
	var id = req.body.id;
	models.Tasks.find({"project_id":id}).exec(function (err, tasks) {
		for (var i=0; i<tasks.length; i++) {
			deleteTaskForId(tasks[i]._id);
		}
	});
	models.Meetings.find({"project_id":id}).remove(function (err) {
		models.Projects.find({"_id":id}).remove(function (err) {
			if (err) res.json({"result":0});
			res.json({"result":1});
		});
	});
}

function deleteTaskForId(id) {
	models.Tasks.find({"parent_id":id}).remove(function (err) {
		models.Tasks.find({"_id":id}).remove(function (err) {
			if (err) console.log(err);
		});
	});
}
