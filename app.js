	
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')
var partials = require('express-partials');

var index = require('./routes/index');
var projects = require('./routes/projects');
var agenda = require('./routes/agenda');
var createtask = require('./routes/createTask');
var auth = require('./routes/auth');

// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.post('/login', auth.userLogin);
app.get('/logout', auth.userLogout);
app.post('/create_user', auth.createUser);     
app.get('/projects', auth.checkAuth, projects.viewProjects);
app.get('/agenda', auth.checkAuth, agenda.viewAgenda);
app.get('/projects/create', auth.checkAuth, projects.createProject);
app.get('/projects/save', auth.checkAuth, projects.saveProject);
app.get('/projects/save/:projectId', auth.checkAuth, projects.saveProject);
app.get('/projects/:projectId', auth.checkAuth, projects.viewProjects);
app.get('/projects/:projectId/tasks/:taskId', auth.checkAuth, createtask.viewTask);
app.get('/projects/edit/:projectId', auth.checkAuth, projects.editProject);
app.get('/create', auth.checkAuth, createtask.createTaskMeeting);
app.get('/create/:projectId', auth.checkAuth, createtask.createTaskMeeting);
app.post('/create/meeting', auth.checkAuth, createtask.createMeeting);
app.post('/create/task', auth.checkAuth, createtask.createTask);
app.post('/edit/meeting/:projectId/:id', auth.checkAuth, createtask.editMeeting);
app.post('/edit/task/:projectId/:id', auth.checkAuth, createtask.editTask);

// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
