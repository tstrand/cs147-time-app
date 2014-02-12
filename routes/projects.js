var data = require('../data.json');

exports.viewProjects = function(req, res) { 
	var projectId = req.params.projectId; 
	console.log(projectId);
	if(projectId) {
		res.render('project', {"projectId": projectId});
	} else {
		res.render('projects', data);
	}
};

exports.newProject = function(req, res) {
	res.render('newProject');
}

exports.createProject = function(req, res) {    
	var project = {
		"id": Math.floor(Math.random() * 1000) + 10,
		"name": req.query.name,
		"dueDate": req.query.duedate,
		"description": 	req.query.description,
		"members": req.query.members	
	};
	console.log(project);
	data["projects"].push(project);
	res.render('projects', data);
 }