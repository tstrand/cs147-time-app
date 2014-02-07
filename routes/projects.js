var data = require('../data.json');

exports.viewProjects = function(req, res) { 
  res.render('projects', data);
};
