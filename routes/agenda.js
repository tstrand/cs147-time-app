var data = require('../data.json');

exports.viewAgenda = function(req, res) { 
  var name = req.params.name; 

  // filter my tasks
  mydata = {};
  mydata["tasks"] = [];
  mydata["meetings"] = [];
  for (var i=0; i<data["tasks"].length; i++) {
  	for (var j=0; j<data["tasks"][i]["members"].length; j++) {
      if (req.session.user_id == data["tasks"][i]["members"][j]) {
        mydata["tasks"].push(data["tasks"][i]);
        break;
      }
    }
  }
  for (var i=0; i<data["meetings"].length; i++) {
    for (var j=0; j<data["meetings"][i]["members"].length; j++) {
      if (req.session.user_id == data["meetings"][i]["members"][j]) {
        mydata["meetings"].push(data["meetings"][i]);
        break;
      }
    }
  }

  mydata["pageName"] = "My Agenda";
  res.render('agenda', mydata);
};
