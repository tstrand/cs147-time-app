
/*
 * GET home page.
 */

exports.view = function(req, res){
  console.log(req.session.user_id);
  if (!req.session.user_id) {
    res.render('index', {});
  } else {
    res.render('index', {
      "user_id": req.session.user_id
    })
  }
};