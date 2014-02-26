//var data = require('../data.json');
var models = require('../models');

/* helper method */
function formatDateString(list, type) {
	//var list = lists.toObject();
	var newList = [];
	for (var i=0; i<list.length; i++) {
		newList.push(list[i].toObject());
		if (type == "projects" || type == "tasks") {
			console.log(list[i]["dueDate"].toDateString());
			newList[i]["dueDate"] = list[i]["dueDate"].toDateString();
		} else {
			newList[i]["datetime"] = list[i]["datetime"].toDateString() + " " + 
									 list[i]["datetime"].toTimeString().split(" ")[0];
		}
	}
	console.log(newList);
	return newList;
}

exports.viewProjects = function(req, res) { 
	var mydata = {}
	models.Projects.find({"members":req.session.username}).sort("dueDate").exec(afterQuery);

	function afterQuery(err, projects) {
		console.log(projects);
		mydata["pageName"] = "My Projects";
		mydata["projects"] = formatDateString(projects, "projects");
		res.render('projects', mydata);
	}
};

exports.viewProject = function(req, res) {
	console.log("in");
	var projectId = req.params.projectId; 
	var object;

	models.Projects.find({"_id":projectId}).exec(gotProject);

	function gotProject(err, project) {
		object = project[0];
		object["pageName"] = object["name"];
		hasProject = true;
		models.Meetings.find({"project_id":projectId}).sort("datetime").exec(gotMeeting);
	}

	function gotMeeting(err, meetings) {
		object["meetings"] = formatDateString(meetings,"meetings");
		hasMeeting = true;
		console.log("got meeting");
		models.Tasks.find({"project_id":projectId}).sort("dueDate").exec(gotTasks);
	}

	function gotTasks(err, tasks) {
		tasks = formatDateString(tasks, "tasks");
		object["tasks"] = [];
		object["completed_tasks"] = [];
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
	  		var taskId = object["tasks"][i]["_id"];
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
	      	var taskId = object["completed_tasks"][i]["_id"];
	      	console.log(taskId);
	      	for (var j=0; j<tasks.length; j++) {
	      		if (tasks[j]["parent_id"] == taskId) {
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
}

exports.createProject = function(req, res) {
	data = {};
	data["pageName"] = "Create Project";
	data["username"] = req.session.username;
	res.render('saveProject', data);
}

exports.editProject = function(req, res) {   
	console.log("EIDITNG PROJECT"); 
	var id = req.params.projectId; 
	models.Projects.find({"_id":id}).exec(function (err, project) {
		console.log(project);
		if (project.length) {
			var object = project[0];
			object["pageName"] = "Edit Project";
			object["edit"] = true;
			res.render('saveProject', object);
		} else {
			res.redirect("/");
		}
	});
 }

exports.updateSubtask = function(req, res) {
	var subtask_id = req.params.subtaskId;
	var bool = req.params.bool;
	var task_id;

	models.Tasks.find({
		"_id":subtask_id
	}).exec(afterFindingSubtask);

    function afterFindingSubtask(err, subtask) {
    	if (err) console.log(err);
    	else {
    		console.log(subtask[0].parent_id);
    		subtask[0].done = parseInt(bool);
    		var parent_id = subtask[0].parent_id;
    		subtask[0].save(function(err) {
    			models.Tasks.find({"parent_id":parent_id}).exec(updateRest);
    		});
    	}
    }

    function updateRest(err, subtasks) {
    	console.log("UPDATEREST");

    	var num = 0;
    	var denom = 0;
    	for (var i=0; i<subtasks.length; i++) {
    		denom += subtasks[i]["duration"];
    		if (subtasks[i]["done"]) num += subtasks[i]["duration"];
    	}

    	models.Tasks.find({"_id": subtasks[0].parent_id})
    		.exec(function(err,task) {
    			if (num == denom) task[0]["done"] = 1;
    			else task[0]["done"] = 0;
    			task[0]["progress"] = (num * 100 / denom);
    			task[0].save(function(err) {
    				res.json([task[0]._id, (num * 100) / denom, bool, subtask_id]);
    			});
    		});
    }
}

exports.saveProject = function(req, res) {
	console.log("")
	var id = req.params.projectId; 
	var edit = id ? true : false;
	//if(!edit) var id = Math.floor(Math.random() * 1000) + 10;

	// now member is an array of username
	var members = []
	for (var i in req.query.members.split(",")) {
		members.push(req.query.members.split(",")[i].trim());
	}
	// by default it adds the creator
	if (members[0] == "") members = [req.session.username];
	var project = {
		"name": req.query.name,
		"dueDate": new Date(req.query.duedate),
		"description": 	req.query.description,
		"members": members	
	};
	if(edit) {
		project["_id"] = id;
		console.log("EDITING");
		console.log(project);
		models.Projects.find({"_id":id}).remove(function(err) {
			models.Projects(project).save(function (err,project) {
				res.redirect('/projects/' + id);
			});
		});
	} else {
		models.Projects(project).save(function (err, project) {
			console.log("CREATE");
			console.log(project);
			var pid = project._id;
			res.redirect('/projects/' + pid);
		});
	}
 }
