var data = require('../data.json');

exports.viewProjects = function(req, res) { 
	var projectId = req.params.projectId; 
	if(projectId) {
		var object;
		for(var i = 0; i < data["projects"].length; i++) {
			if(projectId == data["projects"][i]["id"]) {
				object = data["projects"][i];
				break;
			}
		}
		object["pageName"] = object["name"];
		// filter tasks and meetings
		object["tasks"] = [];
		object["meetings"] = [];
		object["completed_tasks"] = [];
		for (var i=0; i<data["tasks"].length; i++) {
	  		if (data["tasks"][i]["project_id"] == projectId && data["tasks"][i]["parent"] == -1) { 
        		if(data["tasks"][i]["done"]) {
        			object["completed_tasks"].push(data["tasks"][i]);
        		} else {
        			object["tasks"].push(data["tasks"][i]);
        		}
        	}
	  	}
	  	for (var i=0; i<data["meetings"].length; i++) {
	    	if (data["meetings"][i]["project_id"] == projectId) {
	    		object["meetings"].push(data["meetings"][i]);
	  		}
	  	}

    	// add subtasks to each task
    	for (var i=0; i<object["tasks"].length; i++) {
      		var subtasks = [];
      		// select all subtasks whose parent is task id
      		var taskId = object["tasks"][i]["id"];
      		for (var j=0; j<data["tasks"].length; j++) {
        		if (data["tasks"][j]["parent"] == taskId) {
          			subtasks.push(data["tasks"][j]);
        		}
      		}
      		object["tasks"][i]["subtasks"] = subtasks;
    	}

	    // add subtasks to each completed task
	    for (var i=0; i<object["completed_tasks"].length; i++) {
	    	var subtasks = [];
	      	// select all subtasks whose parent is task id
	      	var taskId = object["completed_tasks"][i]["id"];
	      	console.log(taskId);
	      	for (var j=0; j<data["tasks"].length; j++) {
	      		if (data["tasks"][j]["parent"] == taskId) {
	          		subtasks.push(data["tasks"][j]);
	        	}
	      	}
	      	object["completed_tasks"][i]["subtasks"] = subtasks;
	    }

		res.render('project', object);
	} else {
		// just show user's projects
		var mydata = {}
		mydata["projects"] = [];
		for (var i=0; i<data["projects"].length; i++) {
		    for (var j=0; j<data["projects"][i]["members"].length; j++) {
			    if (req.session.user_id == data["projects"][i]["members"][j] ||
			        req.session.username == data["projects"][i]["members"][j]) {
			        mydata["projects"].push(data["projects"][i]);
			        break;
			    }
			}
		}

		mydata["pageName"] = "My Projects";
		res.render('projects', mydata);
	}
};

exports.createProject = function(req, res) {
	data["pageName"] = "Create Project";
	res.render('saveProject', data);
}

exports.editProject = function(req, res) {    
	var id = req.params.projectId; 
	var object = [];
	for(var i = 0; i < data["projects"].length; i++) {
		if(data["projects"][i]["id"] == id) {
			object = data["projects"][i];
			break;
		}
	}
	object["pageName"] = "Edit Project";
	object["edit"] = true;
	res.render('saveProject', object);
 }

exports.saveProject = function(req, res) {
	var id = req.params.projectId; 
	var edit = id ? true : false;
	if(!edit) var id = Math.floor(Math.random() * 1000) + 10;

	// now member is an array of username
	var members = []
	for (var i in req.query.members.split(",")) {
		members.push(req.query.members.split(",")[i].trim());
	}
	var project = {
		"id": id,
		"name": req.query.name,
		"dueDate": req.query.duedate,
		"description": 	req.query.description,
		"members": members	
	};
	if(edit) {
		for(var i = 0; i < data["projects"].length; i++) {
			if(data["projects"][i]["id"] == id) {
				data["projects"][i] = project;
				break;
			}
		}
	} else {
		data["projects"].push(project);
	}
	res.redirect('/projects/' + id);
 }
