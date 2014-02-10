exports.viewTodos = function(req, res) { 
  var name = req.params.name; 
  res.render('todos', {
    "pageName": "My Agenda",
  	"todos":[
      {
        "id": 1,
        "project": "Project Example 1",
        "projectId": "project1",
        "type": "subtask",
        "name": "Example subask 1",
        "dueDate": "2014-02-13",
        "parent": 3,
        "done": false,
        "notes": "This is a note field to add more details. This will show when you press show details and hide when you press hide."
      },
      {
        "id": 2,
        "project": "Project Example 1",
        "projectId": "project1",
        "type": "subtask",
        "name": "Example subask 2",
        "dueDate": "2014-02-14",
        "parent": 3,
        "done": false,
        "notes": "This is a note field to add more details. This will show when you press show details and hide when you press hide."

      },
      {
        "id": 5,
        "project": "Project Example 1",
        "projectId": "project1",
        "type": "meeting",
        "name": "engineering meeting",
        "dueDate": "2014-02-14 17:00",
        "done": false,
        "notes": "This is a note field to add more details. This will show when you press show details and hide when you press hide."
      },
      {
        "id": 3,
        "project": "Project Example 1",
        "projectId": "project1",
        "type": "task",
        "name": "Example Task 1",
        "dueDate": "2014-02-15",
        "done": false,
        "notes": "This is a note field to add more details. This will show when you press show details and hide when you press hide."
      },
      {
        "id": 4,
        "project": "Project Example 2",
        "projectId": "project2",
        "type": "task",
        "name": "Example Task Long Name Long Name Long Name",
        "dueDate": "2014-02-17",
        "done": false,
        "notes": "This is a note field to add more details. This will show when you press show details and hide when you press hide."
      },
  	]
  });
};
