var ejs = require("ejs");

exports.loadhomepage = function(req,res){
	ejs.renderFile('./views/login.ejs', function(err, result) {

		if (!err) {
			res.end(result);
			console.log("Main Login Page rendered successfully");
		}

		else {
			res.end('An error occurred while rendering Index page');
			console.log(err);
		}
	});

};

// Redirects to the homepage
exports.loadhome = function(req, res) {
	// Checks before redirecting whether the session is valid

	if (req.session.username) {
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("landingpage", {
			username : req.session.username
		});
	} else {
		res.redirect('/');
	}
};

exports.logout = function(req, res) {
	console.log("in destroy session function");
	req.logout();
	req.session.destroy();
	res.redirect('/');
};
