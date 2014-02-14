var data = require('../data.json');

exports.viewAgenda = function(req, res) { 
  var name = req.params.name; 

  // filter my tasks
  mydata = {};
  mydata["tasks"] = [];
  mydata["meetings"] = [];
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

  // getting parent task
  //for (var i=0; i<mydata["tasks"]; i++)

  mydata["pageName"] = "My Agenda";
  res.render('agenda', mydata);
};
