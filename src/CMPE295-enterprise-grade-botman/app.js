var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// initialize App
var app = express();

// include Passportjs dependancies
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

// initialize ROUTES to be used
var login = require('./routes/login');

// initialize express session to be maintained
var session = require('express-session');

app.use(session({
  secret: 'teamranjan_botman',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

// initialize the VIEW Engine to be used
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// initialize the BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// initialize the Server Port
app.set('port', (process.env.PORT || 3000));

// initialize the public Static Folder to locate resources
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login);


app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});
