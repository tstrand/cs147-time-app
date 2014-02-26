var data = require('../data.json');
var models = require('../models');


exports.createTaskMeeting = function(req, res) {
    var projectId = req.params.projectId; 
    if (!projectId) res.redirect('/projects');
    console.log(projectId);

    models.Projects.find({"_id":projectId}).exec(function (err,project) {
      var obj = {};
      obj["projectId"] = projectId;
      obj["project_members"] = project[0]["members"];
      obj["create"] = true;
      res.render('createTask',obj);
    });
}

exports.editTask = function(req, res) {
  var projectId = req.params.projectId;
  var id = req.params.id;
  var task = {};

  models.Tasks.find({"_id":id}).exec(function (err,t) {
    task = t[0];
    models.Projects.find({"_id":projectId}).exec(gotProject);
  });

  function gotProject(err,project) {
    task["project_members"] = project[0]["members"];
    console.log(project[0]["members"]);
    // get all the subtasks
    models.Tasks.find({"parent_id":id}).exec(gotSubtasks);
  }

  function gotSubtasks(err,subtasks) {
    var checklists = [];
    var itemNames = ["item1", "item2", "item3", "item4", "item5"];
    for (var i=0; i<subtasks.length; i++) {
      task[itemNames[i]] = subtasks[i];
      console.log(task);
    }
    task["taskedit"] = true;
    task["projectId"] = projectId;
    console.log(task);
    res.render('createTask', task);
  }
}

exports.editMeeting = function(req, res) {
  var projectId = req.params.projectId;
  var id = req.params.id;
  var meeting = {};

  models.Meetings.find({"_id":id}).exec(function (err,m) {
    meeting = m[0];
    models.Projects.find({"_id":projectId}).exec(function(err,project) {
      meeting["project_members"] = project[0]["members"];
      console.log(meeting);
      var date = meeting["datetime"].toString().split(" ")[1] + " " +
        meeting["datetime"].toString().split(" ")[2] + " " + 
        meeting["datetime"].toString().split(" ")[3];
      var time = meeting["datetime"].toString().split(" ")[4];
      meeting["date"] = date;
      meeting["hour"] = time.split(":")[0];
      meeting["min"] = time.split(":")[1];
      meeting["meetingedit"] = true;
      meeting["projectId"] = projectId;
      console.log(meeting);
      res.render('createTask', meeting);
    });
  });

}

exports.createMeeting = function(req, res) {
  var members = []
  for (var i in req.body.attendees.split(",")) {
    members.push(req.body.attendees.split(",")[i].trim());
  }
  var newMeeting = {
    "project_id": req.body.projectId,
    "name": req.body.name,
    "notes": req.body.notes,
    "datetime": req.body.duedate + " " + req.body.hour + ":" + req.body.min,
    "members": members
  }
  if (req.body.id) {
    console.log("EDIT");
    //EDIT
    newMeeting["_id"] = req.body.id;
    models.Meetings.find({"_id":req.body.id}).remove(function (err) {
      models.Meetings(newMeeting).save(function (err) {
        res.redirect('/projects/' + req.body.projectId);
      });
    });
  } else {
    console.log("CREATIng");
    console.log(newMeeting);
    models.Meetings(newMeeting).save(function (err) {
      res.redirect('/projects/' + req.body.projectId);
    });
  }
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
