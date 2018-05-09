const {Wit, log} = require('node-wit');
const request = require("request");
const access_token = 'VEA6CN4I6UTPMSCZERZYGMFA4NCZBFWV';


const client = new Wit({accessToken: access_token,
        logger: new log.Logger(log.DEBUG)});

client.message('Hi', {})
    .then((data) => {
        console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
    })
    .catch(console.error);



/*
Definition
  POST https://api.wit.ai/apps
Example request
  $ curl -XPOST 'https://api.wit.ai/apps?v=20170307' \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My_New_App",
       "lang":"en",
       "private":"false"}'
Example response
{
  "access_token" : "NEW_ACCESS_TOKEN",
  "app_id" : "NEW_APP_ID"
}
*/

function createBot(botname) {
    request.post({
        "headers": { "content-type": "application/json" ,
        "Authorization": "Bearer " + access_token},
        "url": "https://api.wit.ai/apps?v=20170307",
        "body": JSON.stringify({
            "name":botname,
            "lang":"en",
            "private":"false"
        })
    }, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        console.dir(JSON.parse(body));
    });
}

//createBot("testBot");