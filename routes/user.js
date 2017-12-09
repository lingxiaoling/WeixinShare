
/*
 * GET users listing.
 */

exports.users = function(req, res){
  res.render('users.ejs', { title: 'Express' });
};