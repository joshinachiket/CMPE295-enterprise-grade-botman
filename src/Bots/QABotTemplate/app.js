var express 		= require('express');
var bodyParser 		= require('body-parser');
var fs              = require('fs');
var path 			= require('path');
var request         = require("request");

var app 			= express();
var port 			= process.env.PORT || 1732;

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use( express.static(path.join(__dirname, 'ui')));

// Test the app
app.get('/', function(req, res) {
	res.status(200).send('We welcome you on port number: ' + port);
});

function keysToLowerCase(obj) {
    if (!typeof(obj) === "object" || typeof(obj) === "string" || typeof(obj) === "number" || typeof(obj) === "boolean") {
        return obj;
    }
    var keys = Object.keys(obj);
    var n = keys.length;
    var lowKey;
    while (n--) {
        var key = keys[n];
        if (key === (lowKey = key.toLowerCase()))
            continue;
        obj[lowKey] = keysToLowerCase(obj[key]);
        delete obj[key];
    }
    return (obj);
}

//read config file
var jsonData = JSON.parse(fs.readFileSync("bot_config.json"));
var botName = jsonData.botname;
var userName = jsonData.username;
var responseMap = keysToLowerCase(jsonData.responseConfig);


function sendRequestToFramework(message) {

    var options ={
        method: 'PUT',
        uri: 'http://localhost:3000/bot/'+botName+"/unmapped",
        json: {
            'userName' : userName,
            'unmappedQue' : message
        }
    }
    console.log(options);
    request(
        options,
        function (error, reqponse, body) {
        if (error) {
            console.log(error);
            console.log('Error sending the message to Framework');
        } else {
            console.log('Successfully sent message to Server');
        }
    });
}


//generate ui for the bot
app.get('/bot',function (req,res) {
    res.sendFile(path.join(__dirname+'/ui/chatWindow.html'));
});

//give back response
app.post('/bot',function (req,res) {
    json_response = {
        statusCode: 200,
        message: ""
    };

    if (responseMap.hasOwnProperty(req.body.message.toLowerCase())) {
        json_response["message"] = responseMap[req.body.message.toLowerCase()];
    } else {
        if (responseMap.hasOwnProperty('default')) {
            json_response["message"] = responseMap.default;
        } else {
            json_response["message"] = '....?';
        }
        //Send unmapped question to Framework
        sendRequestToFramework(req.body.message.toLowerCase());
    }
    res.send(json_response);
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});
