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
		for (var i=0; i<data["tasks"].length; i++) {
	  	if (data["tasks"][i]["project_id"] == projectId &&
          data["tasks"][i]["parent"] == -1) 
        object["tasks"].push(data["tasks"][i]);
	  }
	  for (var i=0; i<data["meetings"].length; i++) {
	    if (data["meetings"][i]["project_id"] == projectId) 
        object["meetings"].push(data["meetings"][i]);
	  }

    // add subtasks to each task
    for (var i=0; i<object["tasks"].length; i++) {
      var subtasks = [];
      // select all subtasks whose parent is task id
      var taskId = object["tasks"][i]["id"];
      console.log(taskId);
      for (var j=0; j<data["tasks"].length; j++) {
        if (data["tasks"][j]["parent"] == taskId) {
          subtasks.push(data["tasks"][j]);
          console.log("hey");
        }
      }
      console.log(subtasks);
      console.log(object["tasks"][0]["subtasks"]);
      object["tasks"][i]["subtasks"] = subtasks;
      console.log(object["tasks"]);
    }


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