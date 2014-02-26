var data = require('../data.json');
var models = require('../models');

exports.checkAuth = function(req, res, next) { 
  if (!req.session.user_id) {
    res.redirect('/');
  } else {
    next();
  }
}

exports.userLogin = function(req, res) {
  var post = req.body;
  models.Users.find({"username": post.username})
        .exec(afterQuery);

  function afterQuery(err, user) {
    if (err) console.log(err);
    console.log(user);
    if (user.length && user[0]["password"] == post.password) {
      req.session.user_id = post.username;
      req.session.username = post.username;
      res.redirect('/');
    } else {
      res.send('Bad user/pass');
    }
  }
}

exports.userLogout = function(req, res) {
  delete req.session.user_id;
  delete req.session.username;
  res.redirect('/');
}

exports.createUser = function(req, res) {
  var newUser = models.Users({
    "name": req.body.fullname,
    "username": req.body.username,
    "password": req.body.password,
  });
  console.log(req.body.username);
  newUser.save(function(err) {
    req.session.user_id = req.body.username;
    req.session.username = req.body.username;
    res.redirect('/');
  });
}