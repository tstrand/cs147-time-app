	
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')
var partials = require('express-partials');
var mongoose = require('mongoose');

var index = require('./routes/index');
var projects = require('./routes/projects');
var createtask = require('./routes/createTask');
var auth = require('./routes/auth');
var api = require('./routes/api');
var about = require('./routes/about');

var local_database_name = 'cs147project';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);
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
app.get('/', index.viewAgenda);
// for AB Test
app.get('/ab_index', index.viewAlternateAgenda);
app.post('/login', auth.userLogin);
app.get('/logout', auth.userLogout);
app.post('/create_user', auth.createUser);
app.get('/about',auth.checkAuth,about.view);
app.get('/projects', auth.checkAuth, projects.viewProjectsPage);
app.get('/projects/create', auth.checkAuth, projects.createProject);
app.get('/projects/save', auth.checkAuth, projects.saveProject);
app.get('/projects/save/:projectId', auth.checkAuth, projects.saveProject);
app.get('/projects/:projectId', auth.checkAuth, projects.viewProject);
app.get('/projects/:projectId/:taskId', auth.checkAuth, projects.viewProject);
app.get('/subtasks/:subtaskId/:bool', auth.checkAuth, projects.updateSubtask);
app.get('/project/edit/:projectId', auth.checkAuth, projects.editProject);
//app.get('/projects/delete/:projectId', auth.checkAuth, projects.deleteProject);
app.get('/create', auth.checkAuth, createtask.createTaskMeeting);
app.get('/create/:projectId/:task', auth.checkAuth, createtask.createTaskMeeting);
app.post('/create/meeting', auth.checkAuth, createtask.createMeeting);
app.post('/create/task', auth.checkAuth, createtask.createTask);
app.get('/edit/meeting/:projectId/:id', auth.checkAuth, createtask.editMeeting);
app.get('/edit/task/:projectId/:id', auth.checkAuth, createtask.editTask);

/* api calls */
app.get('/api/get_users', auth.checkAuth, api.getUsers);
app.get('/api/valid/:username', auth.checkAuth, api.validUser);
app.post('/delete/task', auth.checkAuth, api.deleteTask);
app.post('/delete/meeting', auth.checkAuth, api.deleteMeeting);
app.post('/delete/project', auth.checkAuth, api.deleteProject);
app.post('/subtask/addMember', auth.checkAuth, projects.addMemberSubtask);

// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
