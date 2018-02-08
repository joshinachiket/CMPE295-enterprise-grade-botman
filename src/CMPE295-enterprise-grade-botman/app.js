var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// initialize App
var app = express();

// initialize ROUTES to be used
var login = require('./routes/login');
var users = require('./routes/users');

// initialize express session
var session = require('express-session');

// include Passportjs dependancies
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

// GitHub Client ID and Client Secret obtained from registering app
var GITHUB_CLIENT_ID = "bb99eb75a650d62357c5";
var GITHUB_CLIENT_SECRET = "50571467cb0a3b7d2e463374f52e3e75230f269e";

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
	clientID : GITHUB_CLIENT_ID,
	clientSecret : GITHUB_CLIENT_SECRET,
	callbackURL : "http://127.0.0.1:3000/auth/github/callback"
}, function(accessToken, refreshToken, profile, done) {
	// asynchronous verification, for effect...
	process.nextTick(function() {

		// To keep the example simple, the user's GitHub profile is returned to
		// represent the logged-in user. In a typical application, you would
		// want
		// to associate the GitHub account with a user record in your database,
		// and return that user instead.
		return done(null, profile);
	});
}));


app.use(session({
	secret : 'teamranjan_botman',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Port
app.set('port', (process.env.PORT || 3000));

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', login.loadhomepage);
app.get('/home', ensureAuthenticated, login.loadhome);
app.post('/logout', login.logout);

app.get('/auth/github', passport.authenticate('github', {
	scope : [ 'user:email' ]
}), function(req, res) {
	// The request will be redirected to GitHub for authentication, so this
	// function will not be called.

});

app.get('/auth/github/callback', passport.authenticate('github', {
	failureRedirect : '/'
}), function(req, res) {
	res.redirect('/home');
});


app.listen(app.get('port'), function(){
	console.log('Server started on port '+ app.get('port'));
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		console.log(req.user.username);
		req.session.username = req.user.username;
		return next();
	} else {
		console.log("not authenticated");
		res.redirect('/');
	}

}
