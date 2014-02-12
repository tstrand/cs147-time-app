var data = require('../data.json');

exports.viewProjects = function(req, res) { 
	var projectId = req.params.projectId; 
	console.log(projectId);
	if(projectId) {
		var object;
		for(var i = 0; i < data["projects"].length; i++) {
			if(projectId == data["projects"][i]["id"]) {
				object = data["projects"][i];
				break;
			}
		}
		object["pageName"] = object["name"];
		object["tasks"] = data["tasks"];
		object["meetings"] = data["meetings"];
		res.render('project', object);
	} else {
		data["pageName"] = "My Projects";
		res.render('projects', data);
	}
};

exports.newProject = function(req, res) {
	res.render('newProject');
}

exports.createProject = function(req, res) {    
	var id = Math.floor(Math.random() * 1000) + 10;
	var project = {
		"id": id,
		"name": req.query.name,
		"dueDate": req.query.duedate,
		"description": 	req.query.description,
		"members": req.query.members	
	};
	data["projects"].push(project);
	res.redirect('/projects/' + id);
 }