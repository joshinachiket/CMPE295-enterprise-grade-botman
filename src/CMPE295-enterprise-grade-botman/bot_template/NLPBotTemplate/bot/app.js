const express 		= require('express');
const bodyParser 	= require('body-parser');
const fs            = require('fs');
const path 			= require('path');
const {Wit, log}    = require('node-wit');
const request       = require("request");
var weather 		= require('openweather-apis');

const app 			= express();
const port 			= process.env.PORT || 1732;

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use( express.static(path.join(__dirname, 'ui')));

weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID('e0e2f438f3c2a9fadb88413cecd1d8ff');

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
var serverAdd = jsonData.server_ip;
var responseMap = keysToLowerCase(jsonData.responseConfig);

const client = new Wit({accessToken: jsonData.token,
    logger: new log.Logger(log.DEBUG)});

function sendRequestToFramework(message) {

    var options = {
        method: 'PUT',
        uri: serverAdd+'/bot/'+botName+"/unmapped",
        json: {
            'userName' : userName,
            'unmappedQue' : message
        }
    }
    console.log(options);
    request(
        options,
        function (error, response, body) {
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
    let text = req.body.message.toLowerCase();
    client.message(text, {})
        .then((data) => {
            console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
            if(data.entities && data.entities.intent) {
                let intent = data.entities.intent[0].value;
                console.log(intent);
                if (intent.toLowerCase() === 'weather') {
                    weather.setCity();
                    weather.getAllWeather(function(err, JSONObj){
                        city = 'Weather for city: '+JSONObj.name+', '+JSONObj.sys.country;
                        temp =     'Current temperature: '+(((JSONObj.main.temp*9)/5)+32)+'F ';
                        temp_min = 'Minimum temperature: '+(((JSONObj.main.temp_min*9)/5)+32)+'F ';
                        temp_max = 'Maximum temperature: '+(((JSONObj.main.temp_max*9)/5)+32)+'F ';
                        humidity = 'Humidity           : '+JSONObj.main.humidity+'%';
                        json_response["message"] = city +'<br/>'+temp+'<br/>'+temp_min+'<br/>'+temp_max+humidity;
                    });
                } else {
                    json_response["message"] = responseMap[intent];
                }
                res.send(json_response);
            } else {
                if (responseMap.hasOwnProperty('default')) {
                    json_response["message"] = responseMap.default;
                } else {
                    json_response["message"] = 'Sorry, I didn\'t get that.';
                }
                //Send unmapped question to Framework
                sendRequestToFramework(req.body.message.toLowerCase());
                res.send(json_response);
            }
        })
        .catch(console.error);

});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});
