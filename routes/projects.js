var data = require('../data.json');
var models = require('../models');

exports.viewProjects = function(req, res) { 
	var mydata = {}
	models.Projects.find({"members":req.session.username}).sort("dueDate").exec(afterQuery);

	function afterQuery(err, projects) {
		console.log(projects);
		mydata["pageName"] = "My Projects";
		mydata["projects"] = projects;
		res.render('projects', mydata);
	}
};

exports.viewProject = function(req, res) {
	console.log("in");
	var projectId = req.params.projectId; 
	var object;
	var hasProject = false;
	var hasMeeting = false;
	var hasTask = false;

	models.Projects.find({"_id":projectId}).exec(gotProject);

	function gotProject(err, project) {
		object = project[0];
		object["pageName"] = object["name"];
		hasProject = true;
		models.Meetings.find({"project_id":projectId}).sort("datetime").exec(gotMeeting);
	}

	function gotMeeting(err, meetings) {
		object["meetings"] = meetings;
		hasMeeting = true;
		console.log("got meeting");
		models.Tasks.find({"project_id":projectId}).sort("dueDate").exec(gotTasks);
	}

	function gotTasks(err, tasks) {
		object["tasks"] = [];
		object["completed_tasks"] = [];
		console.log(tasks);
		for (var i=0; i<tasks.length; i++) {
			if (tasks[i]["parent_id"] == -1) {
				if (tasks[i]["done"]) {
					object["completed_tasks"].push(tasks[i]);
				} else {
					object["tasks"].push(tasks[i]);
				}
			}
		}
		// add subtasks to each task
		for (var i=0; i<object["tasks"].length; i++) {
	  		var subtasks = [];
	  		// select all subtasks whose parent is task id
	  		var taskId = object["tasks"][i]["id"];
	  		for (var j=0; j<tasks.length; j++) {
	    		if (tasks[j]["parent_id"] == taskId) {
	      			subtasks.push(tasks[j]);
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
	      	for (var j=0; j<tasks.length; j++) {
	      		if (tasks[j]["parent"] == taskId) {
	          		subtasks.push(tasks[j]);
	        	}
	      	}
	      	object["completed_tasks"][i]["subtasks"] = subtasks;
	    }
	    hasTask = true;
	    console.log("got task");
	    object["task_id"] = req.params.taskId; 
	    console.log(object);
		res.render('project', object);
	}

/*
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

    object["task_id"] = req.params.taskId; 
    console.log(req.params.taskId);
	res.render('project', object);
	*/
}

exports.createProject = function(req, res) {
	data["pageName"] = "Create Project";
	data["username"] = req.session.username;
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

exports.updateSubtask = function(req, res) {
	var subtask_id = req.params.subtaskId;
	var bool = req.params.bool;
	var task_id;
	for (var i=0; i<data["tasks"].length; i++) {
	  	if (data["tasks"][i]["id"] == subtask_id) {
	  		data["tasks"][i]["done"] = parseInt(bool);
	  		task_id = data["tasks"][i]["parent"];
	  		break;
        }
    }
    var percent = updateTask(task_id, bool, data);
	var obj = [task_id, percent, bool, subtask_id];
	res.json(obj);
}

function updateTask(task_id, bool, data) {
	var num = 0;
	var denom = 0;

	for (var i=0; i<data["tasks"].length; i++) {
	  	if (data["tasks"][i]["parent"] == task_id) {
	  		denom += data["tasks"][i]["duration"];
	  		if(data["tasks"][i]["done"] == 1) {
	  			num += data["tasks"][i]["duration"];
	  		}
        }
    }

    for (var i=0; i<data["tasks"].length; i++) {
	  	if (data["tasks"][i]["id"] == task_id) {
	  		data["tasks"][i]["done"] = (num == denom);
	  		data["tasks"][i]["progress"] = (num * 100 / denom);
        }
    }
 
    return (num * 100 / denom);
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
	// by default it adds the creator
	if (members[0] == "") members = [req.session.username];
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
