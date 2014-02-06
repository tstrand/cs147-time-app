var data = require('../data.json');

exports.viewProjects = function(req, res) { 
  var name = req.params.name; 
  console.log("The project name is: " + name);
  res.render('projects', data);
};
