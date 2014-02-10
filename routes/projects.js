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
