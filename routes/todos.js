var data = require('../data.json');

exports.viewTodos = function(req, res) { 
  var name = req.params.name; 
  data["pageName"] = "My Agenda";
  res.render('todos', data);
};
