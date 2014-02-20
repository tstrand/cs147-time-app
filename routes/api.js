var data = require("../data.json");

exports.getUsers = function(req, res) {
	var usernames = [];
	for (var i=0; i<data["users"].length; i++) {
		usernames.push(data["users"][i]["username"]);
	}
	res.json(usernames);
}

exports.validUser = function(req, res) {
	var username = req.params.username;
	var usernames = [];
	for (var i=0; i<data["users"].length; i++) {
		usernames.push(data["users"][i]["username"]);
	}
	if (usernames.indexOf(username) != -1) res.json({"result": 1});
	else res.json({"result":0});
}