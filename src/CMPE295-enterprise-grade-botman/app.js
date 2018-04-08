var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

// initialize App
var app = express();

// include Passportjs dependancies
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

// initialize ROUTES to be used
var login = require('./routes/login');
var user = require('./routes/user');

// initialize express session to be maintained

// URL for mongoDB session maintainence
var mongoSessionConnectURL = "mongodb://admin:cmpe295b@ds231589.mlab.com:31589/cmpe295-enterprise-grade-botman";
var session = require('express-session');
var mongoStore = require("connect-mongo")(session);
var mongo = require("./database/mongodb");


app.use(session({
  secret: 'cmpe295b-teamranjan_botman',
  resave: false, // dont save a session if it's not modified
  saveUninitialized: false, // don't create session until something is stored
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  store: new mongoStore({
    url: mongoSessionConnectURL
  })
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
app.use('/user', user);

// GET APIS
// app.get('/getUserBots', user.getUserBots);

//POST APIS

// connect to the mongo collection session and then createServer
// all user information is now saved in the session collection

mongo.connect(mongoSessionConnectURL, function() {
  console.log('Connected to mongo at: ' + mongoSessionConnectURL);
  http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
});
