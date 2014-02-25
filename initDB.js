
/*
  This script will initialize a local Mongo database
  on your machine so you can do development work.

  IMPORTANT: You should make sure the

      local_database_name

  variable matches its value in app.js  Otherwise, you'll have
  initialized the wrong database.
*/

var mongoose = require('mongoose');
var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
// MAKE SURE TO CHANGE THE NAME FROM 'lab7' TO ... IN OTHER PROJECTS
var local_database_name = 'cs147project';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);


// Do the initialization here

// Step 1: load the JSON data
var projects_json = require('./data.json');

// Step 2: Remove all existing documents
models.Users
  .find()
  .remove()
  .exec(onceClear);

models.Projects
  .find()
  .remove()
  .exec(saveProjects); // callback to continue at

models.Tasks
  .find()
  .remove()
  .exec(saveTasks);

// Step 3: load the data from the JSON file
function onceClear(err) {
  if(err) console.log(err);

  // Saving Users
  var to_save_count = projects_json["users"].length;
  for(var i=0; i<projects_json["users"].length; i++) {
    var json = projects_json["users"][i];
    var usr = new models.Users(json);

    usr.save(function(err, usr) {
      if(err) console.log(err);

      to_save_count--;
      console.log(to_save_count + ' left to save');
      if(to_save_count <= 0) {
        console.log('DONE');
        // The script won't terminate until the 
        // connection to the database is closed
        //mongoose.connection.close()
      }
    });
  }
}

function saveProjects(err) {
  if(err) console.log(err);

  // Saving Users
  var to_save_count = projects_json["projects"].length;
  for(var i=0; i<projects_json["projects"].length; i++) {
    var json = projects_json["projects"][i];
    var usr = new models.Projects(json);

    usr.save(function(err, usr) {
      if(err) console.log(err);

      to_save_count--;
      console.log(to_save_count + ' pj left to save');
      if(to_save_count <= 0) {
        console.log('DONE');
        // The script won't terminate until the 
        // connection to the database is closed
        //mongoose.connection.close()
      }
    });
  } 
}

function saveTasks(err) {
  if(err) console.log(err);

  // Saving Users
  var to_save_count = projects_json["tasks"].length;
  for(var i=0; i<projects_json["tasks"].length; i++) {
    var json = projects_json["tasks"][i];
    var usr = new models.Tasks(json);

    usr.save(function(err, usr) {
      if(err) console.log(err);

      to_save_count--;
      console.log(to_save_count + ' task left to save');
      if(to_save_count <= 0) {
        console.log('DONE');
        // The script won't terminate until the 
        // connection to the database is closed
        mongoose.connection.close()
      }
    });
  } 
}

