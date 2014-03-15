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

exports.viewAgenda = function(req, res) { 
  if (!req.session.user_id) {
    res.render('index', {});
  } else {
    var name = req.params.name; 

    // filter my tasks
    var object = {};

    models.Meetings.find().sort("datetime").exec(gotMeeting);

    function gotMeeting(err, meetings) {
      meetings = formatDateString(meetings, "meetings");
      object["meetings"] = [];
      for (var i=0; i<meetings.length; i++) {
        for (var j=0; j<meetings[i]["members"].length; j++) {
          if (req.session.username == meetings[i]["members"][j]) {
            var curr = new Date();
            var date = new Date(meetings[i]["datetime"]);
            if(curr.getTime() > date.getTime()) {
              console.log("complete");
              console.log(date.getTime());
              meetings[i]["complete"] = true;
            } else {
              console.log("incomplete");
              console.log(date.getTime());
              console.log(curr.getTime());
              meetings[i]["complete"] = false;
            }
            object["meetings"].push(meetings[i]);
            break;
          }
        }
      }
      models.Tasks.find().sort("dueDate").exec(gotTasks);
    }

    function gotTasks(err, tasks) {
      tasks = formatDateString(tasks, "tasks");
      object["tasks"] = [];
      object["completed_tasks"] = [];
      for (var i=0; i<tasks.length; i++) {
        for(var j=0; j<tasks[i]["members"].length; j++) {
          console.log(tasks[i]["parent_id"] != -1);
          if (req.session.username == tasks[i]["members"][j] && tasks[i]["parent_id"] != -1) {
            if (tasks[i]["done"]) {
              object["completed_tasks"].push(tasks[i]);
            } else {
              object["tasks"].push(tasks[i]);
            }
            console.log(tasks[i]);
          }
        }
      }

      for (var i=0; i<object["tasks"].length; i++) {
        // getting parent task
        for (var j=0; j<tasks.length; j++) {
          if (tasks[j]["id"] == object["tasks"][i]["parent_id"]) {
            object["tasks"][i]["parent_name"] = tasks[j]["name"];
            console.log(object["tasks"][i]);
            break;
          }
        }
      }

      for (var i=0; i<object["completed_tasks"].length; i++) {
        // getting parent task
        for (var j=0; j<tasks.length; j++) {
          if (tasks[j]["id"] == object["completed_tasks"][i]["parent_id"]) {
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
      object["name"] = req.session.name;
      object["first_time"] = req.session.first_time;
      res.render('index', object);
    }
  }
}

/* alternative design */
exports.viewAlternateAgenda = function(req, res) { 
  if (!req.session.user_id) {
    res.render('index', {});
  } else {
    var name = req.params.name; 

    // filter my tasks
    var object = {};

    models.Meetings.find().sort("datetime").exec(gotMeeting);

    function gotMeeting(err, meetings) {
      meetings = formatDateString(meetings, "meetings");
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
      tasks = formatDateString(tasks, "tasks");
      object["tasks"] = [];
      object["completed_tasks"] = [];
      for (var i=0; i<tasks.length; i++) {
        for(var j=0; j<tasks[i]["members"].length; j++) {
          console.log(tasks[i]["parent_id"] != -1);
          if (req.session.username == tasks[i]["members"][j] && tasks[i]["parent_id"] != -1) {
            if (tasks[i]["done"]) {
              object["completed_tasks"].push(tasks[i]);
            } else {
              object["tasks"].push(tasks[i]);
            }
            console.log(tasks[i]);
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
      object["name"] = req.session.name;
      // for AB Testing
      object["alternative"] = true;
      if (object["meetings"].length == 0 && object["tasks"].length == 0 && 
          object["completed_tasks"].length == 0) {
        object["hasNothing"] = true;
      }
      object["first_time"] = req.session.first_time;
      res.render('index', object);
    }
  }
}
