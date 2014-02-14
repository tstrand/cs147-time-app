var data = require('../data.json');

exports.viewTask = function(req, res) {
	var projectId = req.params.projectId; 
  	var taskId = req.params.taskId;
	var object;
	for(var i = 0; i < data["tasks"].length; i++) {
		if(data["tasks"][i]["id"] == taskId) {
			object = data["tasks"][i];
			break; 
		}
	}
	var subtasks = [];
	for(var i = 0; i < data["tasks"].length; i++) {
		if(data["tasks"][i]["parent"] == taskId) {
			subtasks.push(data["tasks"][i]);
		}
	}
	object["subtasks"] = subtasks;
	//getting project name
    for (var j=0; j<data["projects"].length; j++) {
      if (data["projects"][j]["id"] == projectId) {
        object["project_name"] = data["projects"][j]["name"];
        break;
      }
    }
	res.render('task', object);
}

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
	data["meetings"].push(newMeeting);
	res.redirect('/projects/' + req.body.projectId);
}

exports.createTask = function(req, res) {
	var id = Math.floor(Math.random() * 1000) + 10;
	var newTask = {
		"id": id,
		"project_id": req.body.projectId,
		"name": req.body.name,
		"notes": req.body.notes,
		"parent": -1,
		"done": false,
		"dueDate": req.body.duedate,
		"members": [req.session.username] //by default creator is the owner of that task
	}
	data["tasks"].push(newTask);

	// add subtasks
	var subtasks = [req.body.subtask1, req.body.subtask2, req.body.subtask3, req.body.subtask4, req.body.subtask5];
	var assignees = [req.body.assigned1,req.body.assigned2,req.body.assigned3,req.body.assigned4,req.body.assigned5];
	for (var i=0; i<5; i++) {
		if (subtasks[i] != "") {
			var members = []
			for (var j in assignees[i].split(",")) {
				members.push(assignees[i].split(",")[j].trim());
			}
			var newSubTask = {
				"id": Math.floor(Math.random() * 1000) + 10,
				"project_id": req.body.projectId,
				"name": subtasks[i],
				"notes": "",
				"parent": id,
				"done": false,
				"dueDate": req.body.duedate,
				"members": members
			}
			data["tasks"].push(newSubTask);
		}
	}
	res.redirect('/projects/' + req.body.projectId);
}
