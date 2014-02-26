var data = require('../data.json');
var models = require('../models');

exports.viewAgenda = function(req, res) { 
  if (!req.session.user_id) {
    res.render('index', {});
  } else {
    var name = req.params.name; 

  // filter my tasks
  mydata = {};
  mydata["tasks"] = [];
  mydata["meetings"] = [];
  mydata["completed_tasks"] = [];
  for (var i=0; i<data["tasks"].length; i++) {
    for (var j=0; j<data["tasks"][i]["members"].length; j++) {
      if ((req.session.user_id == data["tasks"][i]["members"][j] ||
          req.session.username == data["tasks"][i]["members"][j]) &&
          data["tasks"][i]["parent"] != -1) {
        if(data["tasks"][i]["done"]) {
          mydata["completed_tasks"].push(data["tasks"][i]);
        } else {
          mydata["tasks"].push(data["tasks"][i]);
        }
        break;
      }
    }
  }
  for (var i=0; i<data["meetings"].length; i++) {
    for (var j=0; j<data["meetings"][i]["members"].length; j++) {
      if (req.session.user_id == data["meetings"][i]["members"][j] ||
          req.session.username == data["meetings"][i]["members"][j]) {
        var cur = new Date().getTimezoneOffset() * -1;
        console.log(cur);
        if(cur > data["meetings"][i]["datetime"]) { 
          data["meetings"][i]["datetime"] = 0;
        }
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

  for (var i=0; i<mydata["completed_tasks"].length; i++) {
    // getting parent task
    for (var j=0; j<data["tasks"].length; j++) {
      if (data["tasks"][j]["id"] == mydata["completed_tasks"][i]["parent"]) {
        mydata["completed_tasks"][i]["parent_name"] = data["tasks"][j]["name"];
        break;
      }
    }
    //getting project name
    for (var j=0; j<data["projects"].length; j++) {
      if (data["projects"][j]["id"] == mydata["completed_tasks"][i]["project_id"]) {
        mydata["completed_tasks"][i]["project_name"] = data["projects"][j]["name"];
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
  mydata["user_id"] = req.session.user_id;
  mydata["username"] = req.session.username;
  //res.render('agenda', mydata);
    res.render('index', mydata);
  }

};
