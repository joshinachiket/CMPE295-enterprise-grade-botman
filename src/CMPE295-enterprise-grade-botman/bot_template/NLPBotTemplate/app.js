var Botkit 			= require('botkit');
var express 		= require('express');
var bodyParser 		= require('body-parser');
var fs              = require('fs');


var app 			= express();
var port 			= process.env.PORT || 1732;

//body parser middleware
app.use(bodyParser.urlencoded({
	extended : true
}));

// Test the app
app.get('/', function(req, res) {
	res.status(200).send('We welcome you on port number: ' + port);
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

//file operation.
filePath='config.json';
fileContents = ' { "token":"xoxb-345502549281-233MkoKg2CAWHRGYNLlme8Av",' +
	           '  "responseConfig" : {"hi":"hello","bye":"bye","defalut":"Sorry! I could not understand u."}}';
/*fs.writeFile(filePath,fileContents,function(err) {
	if (err) throw err;
});*/

slackToken = "";
responseMap = {};

fs.readFile(filePath, function(err, buf) {
    fileContents = JSON.parse(buf.toString());

    slackToken = fileContents.token;

    for (var key in fileContents.responseConfig) {
        if (fileContents.responseConfig.hasOwnProperty(key)) {
            //console.log(key + " -> " + fileContents.responseConfig[key]);
			responseMap[key] = fileContents.responseConfig[key];
        }
    }
});


var controller = Botkit.slackbot({
	debug : false
});

controller.spawn({
	token :  'xoxb-353628655120-2Lo1IgUDvMgLhAxiTBfEWAbD'//'xoxb-345502549281-233MkoKg2CAWHRGYNLlme8Av'
}).startRTM();

controller.hears('.*',[ 'direct_message', 'direct_mention', 'mention' ],
    function(bot, message) {
        console.log(message.match[0].toUpperCase());
        console.log(responseMap[message.match[0]]);
        if (responseMap[message.match[0]]===undefined) {
            var reply_with_attachments = {
                'username' : 'simple_bot',
                'text' : "Sorry, I didn't understand that :(",
                'mrkdwn': true,
                'icon_url' : 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTvJBPdSX9-5_Zb9lv9zFYqnQWICB4aGn3M9R9koRM-4uoKZYQq'
            };
            bot.reply(message, reply_with_attachments);
        } else {
            var reply_with_attachments = {
                'username' : 'simple_bot',
                'text' : responseMap[message.match[0]],
                'mrkdwn': true,
                'icon_url' : 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTvJBPdSX9-5_Zb9lv9zFYqnQWICB4aGn3M9R9koRM-4uoKZYQq'
            };
            bot.reply(message, reply_with_attachments);
        }
});