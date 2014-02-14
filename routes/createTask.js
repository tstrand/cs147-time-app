var data = require('../data.json');

exports.createTaskMeeting = function(req, res) {
	var projectId = req.params.projectId; 
  	if (!projectId) res.redirect('/projects');
	res.render('createTask', {"projectId":projectId});
}

exports.createMeeting = function(req, res) {
	var members = []
	for (var i in req.body.attendees.split(",")) {
		members.push(req.body.attendees.split(",")[i].trim());
	}
	var newMeeting = {
		"id": Math.floor(Math.random() * 1000) + 10,
		"project_id": req.body.projectId,
		"name": req.body.name,
		"notes": req.body.notes,
		"datetime": req.body.duedate + " " + req.body.hour + ":" + req.body.min,
		"members": members
	}
	console.log(newMeeting);
	data["meetings"].push(newMeeting);
	res.redirect('/projects/' + req.body.projectId);
}
