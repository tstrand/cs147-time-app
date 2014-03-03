var about = require('./about.js');

exports.view = function(req, res){
  req.session.first_time = false;
  res.render('about');
};