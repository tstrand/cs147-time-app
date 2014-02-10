exports.viewProject = function(req, res) { 
  var projectId = req.params.projectId; 
  console.log("The project ID is: " + projectId);
  res.render('project', {"projectId": projectId});
};
