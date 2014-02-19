var data = require('../data.json');

exports.viewAgenda = function(req, res) { 
  var name = req.params.name; 

  // filter my tasks
  mydata = {};
  mydata["tasks"] = [];
  mydata["meetings"] = [];
  mydata["completedSubtasks"] = []
  for (var i=0; i<data["tasks"].length; i++) {
  	for (var j=0; j<data["tasks"][i]["members"].length; j++) {
      if ((req.session.user_id == data["tasks"][i]["members"][j] ||
          req.session.username == data["tasks"][i]["members"][j]) &&
          data["tasks"][i]["parent"] != -1) {
        mydata["tasks"].push(data["tasks"][i]);
        break;
      }
    }
  }
  for (var i=0; i<data["meetings"].length; i++) {
    for (var j=0; j<data["meetings"][i]["members"].length; j++) {
      if (req.session.user_id == data["meetings"][i]["members"][j] ||
          req.session.username == data["meetings"][i]["members"][j]) {
        mydata["meetings"].push(data["meetings"][i]);
        break;
      }
    }
  }

  
  for (var i=0; i<mydata["tasks"].length; i++) {
    // getting parent task
    for (var j=0; j<data["tasks"].length; j++) {
      if (data["tasks"][j]["id"] == mydata["tasks"][i]["parent"]) {
        mydata["tasks"][i]["parent_name"] = data["tasks"][j]["name"];
        break;
      }
    }
    //getting project name
    for (var j=0; j<data["projects"].length; j++) {
      if (data["projects"][j]["id"] == mydata["tasks"][i]["project_id"]) {
        mydata["tasks"][i]["project_name"] = data["projects"][j]["name"];
      }
    }
  }

  for (var i=0; i<mydata["meetings"].length; i++) {
    //getting project name
    for (var j=0; j<data["projects"].length; j++) {
      if (data["projects"][j]["id"] == mydata["meetings"][i]["project_id"]) {
        mydata["meetings"][i]["project_name"] = data["projects"][j]["name"];
      }
    }
  }

  mydata["pageName"] = "My Agenda";
  res.render('agenda', mydata);
};
