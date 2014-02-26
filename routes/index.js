var models = require('../models');

exports.viewAgenda = function(req, res) { 
  if (!req.session.user_id) {
    res.render('index', {});
  } else {
    var name = req.params.name; 

    // filter my tasks
    var object = {};

    models.Meetings.find().sort("datetime").exec(gotMeeting);

    function gotMeeting(err, meetings) {
      object["meetings"] = [];
      for (var i=0; i<meetings.length; i++) {
        for (var j=0; j<meetings[i]["members"].length; j++) {
          if (req.session.username == meetings[i]["members"][j]) {
            object["meetings"].push(meetings[i]);
            break;
          }
        }
      }
      models.Tasks.find().sort("dueDate").exec(gotTasks);
    }

    function gotTasks(err, tasks) {
      object["tasks"] = [];
      object["completed_tasks"] = [];
      for (var i=0; i<tasks.length; i++) {
        for(var j=0; j<tasks[i]["members"]; j++) {
          if (req.session.username == tasks[i]["members"][j] && tasks[i]["parent_id"] == -1) {
            if (tasks[i]["done"]) {
              object["completed_tasks"].push(tasks[i]);
            } else {
              object["tasks"].push(tasks[i]);
            }
          }
        }
      }
      for (var i=0; i<object["tasks"].length; i++) {
        // getting parent task
        for (var j=0; j<tasks.length; j++) {
          if (tasks[j]["id"] == object["tasks"][i]["parent"]) {
            object["tasks"][i]["parent_name"] = tasks[j]["name"];
            break;
          }
        }
      }
      for (var i=0; i<object["completed_tasks"].length; i++) {
        // getting parent task
        for (var j=0; j<tasks.length; j++) {
          if (tasks[j]["id"] == object["completed_tasks"][i]["parent"]) {
            object["completed_tasks"][i]["parent_name"] = tasks[j]["name"];
            break;
          }
        }
      }

      models.Projects.find().exec(gotProject);
    }

    function gotProject(err, projects) {
      for (var i=0; i<object["tasks"].length; i++) {
        //getting project name
        for (var j=0; j<projects.length; j++) {
          if (projects[j]["id"] == object["tasks"][i]["project_id"]) {
            object["tasks"][i]["project_name"] = projects[j]["name"];
            break;
          }
        }
      }

      for (var i=0; i<object["completed_tasks"].length; i++) {
        //getting project name
        for (var j=0; j<projects.length; j++) {
          if (projects[j]["id"] == object["completed_tasks"][i]["project_id"]) {
            object["completed_tasks"][i]["project_name"] = projects[j]["name"];
            break;
          }
        }
      }
      
      for (var i=0; i<object["meetings"].length; i++) {
        //getting project name
        for (var j=0; j<projects.length; j++) {
          if (projects[j]["id"] == object["meetings"][i]["project_id"]) {
            object["meetings"][i]["project_name"] = projects[j]["name"];
            break;
          }
        }
      }

      object["pageName"] = "My Agenda";
      object["user_id"] = req.session.user_id;
      object["username"] = req.session.username;
      res.render('index', object);
    }
  }
};
