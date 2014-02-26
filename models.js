
var Mongoose = require('mongoose');



var UserSchema = new Mongoose.Schema({
	"username": String,
	"name": String,
	"password": String
});

var ProjectSchema = new Mongoose.Schema({
  // fields are defined here
  "name": String,
  "dueDate": Date,
  "description": String,
  "members": Array
});

var TaskSchema = new Mongoose.Schema({
	"project_id": String,
	"name": String,
	"dueDate": Date,
	"duration": Number,
	"notes": String,
	"parent_id": String,
	"done": Number,
	"progress": Number,
	"members": Array
});

var MeetingSchema = new Mongoose.Schema({
	"project_id": String,
	"name": String,
	"datetime": Date,
	"notes": String,
	"members": Array
});

exports.Projects = Mongoose.model('Projects', ProjectSchema);
exports.Users = Mongoose.model('Users', UserSchema);
exports.Tasks = Mongoose.model('Tasks', TaskSchema);
exports.Meetings = Mongoose.model('Meetings', MeetingSchema);
