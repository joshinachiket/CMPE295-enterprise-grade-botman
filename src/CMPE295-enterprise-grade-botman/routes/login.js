// include the VIEW Engine
var ejs = require("ejs");

// include the express router
var express = require('express');
var router = express.Router();

// include Passportjs OAUTH dependancies
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

// GitHub Client ID and Client Secret obtained from registering app
var GITHUB_CLIENT_ID = "bb99eb75a650d62357c5";
var GITHUB_CLIENT_SECRET = "50571467cb0a3b7d2e463374f52e3e75230f269e";

// Passportjs session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
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

// get the landingpage API

router.get('/', function(req, res) {
  ejs.renderFile('./views/login.ejs', function(err, result) {

    if (!err) {
      res.end(result);
      console.log("The Login Page rendered successfully");
    } else {
      res.end("Error while rendering the Login Page");
      console.log(err);
    }
  });

});

router.get('/auth/github', passport.authenticate('github', {
  scope: ['user:email']
}), function(req, res) {
  // The request will be redirected to GitHub for authentication, so this
  // function will not be called.
});

router.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/'
}), function(req, res) {
  res.redirect('/home');
});


// Redirects to the homepage
router.get('/home', ensureAuthenticated, function(req, res) {
  // Checks before redirecting whether the session is valid

  if (req.session.username) {
    // Set these headers to notify the browser not to maintain any cache for
    // the page being loaded
    res.header(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    res.render("landingpage", {
      username: req.session.username
    });
  } else {
    res.redirect('/');
  }
});


// logout functionality with destroying session
router.post('/logout', function(req, res) {
  console.log("in destroy session function");
  req.logout();
  req.session.destroy();
  res.redirect('/');
});


// function makes sure that the authenticated session gets login
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user.username);
    req.session.username = req.user.username;
    return next();
  } else {
    console.log("not authenticated");
    res.redirect('/');
  }
};

module.exports = router;
