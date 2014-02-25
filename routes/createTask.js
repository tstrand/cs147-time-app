var data = require('../data.json');

exports.createTaskMeeting = function(req, res) {
  var projectId = req.params.projectId; 
    if (!projectId) res.redirect('/projects');

    var object = {}
    object["projectId"] = projectId;
    for (var j=0; j<data["projects"].length; j++) {
      if (data["projects"][j]["id"] == projectId) {
        object["project_members"] = data["projects"][j]["members"];
        break;
      }
    }
    // boolean to tell that it's in create mode, note edit mode
    object["create"] = true;
  res.render('createTask', object);
}

exports.editTask = function(req, res) {
  var projectId = req.params.projectId;
  var id = req.params.id;

  // find task
  var task = {};
  for (var i=0; i<data["tasks"].length; i++) {
    if (data["tasks"][i]["id"] == id) {
          task = data["tasks"][i]
          break;
      }       
  }

  // find project for members
  for (var j=0; j<data["projects"].length; j++) {
        if (data["projects"][j]["id"] == projectId) {
          task["project_members"] = data["projects"][j]["members"];
          break;
        }
    }

    // find subtasks for the task
    var checklists = [];
    var itemNames = ["item1", "item2", "item3", "item4", "item5"];
    for (var i=0; i<data["tasks"].length; i++) {
    if (data["tasks"][i]["parent"] == id) {
          checklists.push(data["tasks"][i]);
      }       
  }
  for (var i=0; i<checklists.length; i++) {
    task[itemNames[i]] = checklists[i];
  }

  task["taskedit"] = true;
  task["projectId"] = projectId;
  res.render('createTask', task);
}

exports.editMeeting = function(req, res) {
  var projectId = req.params.projectId;
  var id = req.params.id;

  var meeting = {};
  //find meeting
  for (var i=0; i<data["meetings"].length; i++) {
    if (data["meetings"][i]["id"] == id) {
      meeting = data["meetings"][i]
      break;
    }       
  }
  // find project for members
  for (var j=0; j<data["projects"].length; j++) {
    if (data["projects"][j]["id"] == projectId) {
      meeting["project_members"] = data["projects"][j]["members"];
      break;
    }
  }
  var date = meeting["datetime"].split(" ")[0];
  var time = meeting["datetime"].split(" ")[1];
  meeting["date"] = date;
  meeting["hour"] = time.split(":")[0];
  meeting["min"] = time.split(":")[1];
  meeting["meetingedit"] = true;
  meeting["projectId"] = projectId;
  res.render('createTask', meeting);
}

exports.createMeeting = function(req, res) {
  if (req.body.id) {
    for (var i=data["meetings"].length-1; i>=0; i--) {
      if (data["meetings"][i]["id"] == parseInt(req.body.id)) {
        data["meetings"].splice(i,1);
      }
    }
  }
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
  if (req.body.id) {
    /* remove old tasks and subtasks */
    for (var i=data["tasks"].length-1; i>=0; i--) {
      if (data["tasks"][i]["id"] == parseInt(req.body.id) || 
          data["tasks"][i]["parent"] == parseInt(req.body.id)) {
        data["tasks"].splice(i,1);
      }
    }
    id = req.body.id;
  }
  var newTask = {
    "id": id,
    "project_id": req.body.projectId,
    "name": req.body.name,
    "notes": req.body.notes,
    "parent": -1,
    "done": 0,
    "duration": -1,
    "dueDate": req.body.duedate,
    "members": [req.session.username] //by default creator is the owner of that task
  }
  data["tasks"].push(newTask);

  // add subtasks
  var subtasks = [req.body.subtask1, req.body.subtask2, req.body.subtask3, req.body.subtask4, req.body.subtask5];
  var assignees = [req.body.assigned1,req.body.assigned2,req.body.assigned3,req.body.assigned4,req.body.assigned5];
  var durations = [req.body.duration1,req.body.duration2,req.body.duration3,req.body.duration4,req.body.duration5];
  for (var i=0; i<5; i++) {
    if (subtasks[i] != "") {
      var members = []
      for (var j in assignees[i].split(",")) {
        members.push(assignees[i].split(",")[j].trim());
      }
      var duration = 0;
      if (parseInt(durations[i])) duration = parseInt(durations[i]);
      var newSubTask = {
        "id": Math.floor(Math.random() * 1000) + 10,
        "project_id": req.body.projectId,
        "name": subtasks[i],
        "notes": "",
        "parent": id,
        "done": 0,
        "dueDate": req.body.duedate,
        "duration": duration,
        "members": members
      }
      data["tasks"].push(newSubTask);
    }
  }
  res.redirect('/projects/' + req.body.projectId);
}
