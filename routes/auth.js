var data = require('../data.json');

exports.checkAuth = function(req, res, next) { 
  if (!req.session.user_id) {
    res.redirect('/');
  } else {
    next();
  }
}

exports.userLogin = function(req, res) {
  var post = req.body;
  var user = null;
  for(var i = 0; i < data["users"].length; i++) {
    if(post.username == data["users"][i]["username"]) {
      user = data["users"][i];
      break;
    }
  }
  if (user && post.password == user["password"]) {
    req.session.user_id = user["id"];
    req.session.username = post.username;
    res.redirect('/');
  } else {
    res.send('Bad user/pass');
  }
}

exports.userLogout = function(req, res) {
  delete req.session.user_id;
  delete req.session.username;
  res.redirect('/');
}

exports.createUser = function(req, res) {
  var id = Math.floor(Math.random() * 1000) + 10;
  var newUser = {
    "id": id,
    "name": req.body.fullname,
    "username": req.body.username,
    "password": req.body.password,
  };
  console.log(req.body.username);
  data["users"].push(newUser);
  req.session.user_id = id;
  req.session.username = req.body.username;
  res.redirect('/');
}