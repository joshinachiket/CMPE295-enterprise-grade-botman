const request = require("request");

/*
* To create new Bot
* sample response:
    {
        "access_token": "NPQOPLGNDLNXQRSUB62R5TZ6DWXUTMOO",
        "app_id": "5ae92c5e-c384-43d3-bc7a-f72a380006d3"
    }
* The token from this response is to be used to subsequent operations to this bot.
* */
const createBot = (token, botName, callback) => {
    if(!token || /^\s*$/.test(token)) {
        return {
            status: "FAILURE",
            reason: "Invalid/No token provided"
        }
    }

    if(!botName || /^\s*$/.test(botName)) {
        callback({
            status: "FAILURE",
            reason: "Invalid/No name for new bot provided"
        });
    }

    request.post({
        "headers": { "content-type": "application/json" ,
            "Authorization": "Bearer " + token},
        "url": "https://api.wit.ai/apps?v=20170307",
        "body": JSON.stringify({
            "name":botName,
            "lang":"en",
            "private":"false"
        })
    }, (error, response, body) => {
        if(error) {
            console.log(JSON.stringify(error));
            callback({
                status: "FAILURE",
                reason: error
            });
        }

        if(body) {
            const res = JSON.parse(body);
            console.log(body);
            if(res.app_id) {
                callback({
                    status: "SUCCESS",
                    body: res
                });
            } else {
                callback({
                    status: "FAILURE",
                    reason: res
                });
            }
        } else {
            console.log(JSON.parse(response));
            callback({
                status: "FAILURE",
                reason: JSON.parse(response)
            });
        }
    });
};


/*Create/Update new intent
Eg. queries: ['qery1', 'query2']
Sample response:[
	{
        "text": "Bye",
        "entities": [
          {
            "entity": "intent",
            "value": "byegreeting"
          }
        ]
      },
      {
        "text": "Adios Amigos",
        "entities": [
          {
            "entity": "intent",
            "value": "byegreeting"
          }
        ]
      }
]


*/
const createOrUpdateIntent = (token, intentName, queries, callback) => {
    if(!token || /^\s*$/.test(token)) {
        return {
            status: "FAILURE",
            reason: "Invalid/No token provided"
        }
    }

    if(!intentName || /^\s*$/.test(intentName)) {
        callback({
            status: "FAILURE",
            reason: "Invalid/No intent name provided"
        });
    }

    if(!queries || queries.length == 0) {
        callback({
            status: "FAILURE",
            reason: "No questions to map"
        });
    }

    var req = [];

    for(var i=0; i < queries.length; i++) {
        req.push({
            text: queries[i],
            entities: [
                {
                    entity: "intent",
                    value: intentName
                }
            ]
        });
    }

    console.log("Creating/update intent " + JSON.stringify(req));
    request.post({
        "headers": { "content-type": "application/json" ,
            "Authorization": "Bearer " + token},
        "url": "https://api.wit.ai/samples?v=20170307",
        "body": JSON.stringify(req)
    }, (error, response, body) => {
        if(error) {
            console.log(JSON.stringify(error));
            callback({
                status: "FAILURE",
                reason: error
            });
        }

        if(body) {
            const res = JSON.parse(body);
            console.log(res);
            if(res.sent) {
                callback({
                    status: "SUCCESS",
                    body: body
                });
            } else {
                callback({
                    status: "FAILURE",
                    reason: body
                });
            }
        } else {
            console.log(JSON.parse(response));
            callback({
                status: "FAILURE",
                reason: response
            });
        }
    });
};

/*Function to query user text
* Sample response:
* {
    "_text": "hi",
    "entities": {
        "intent": [
            {
                "confidence": 0.75583913462514,
                "value": "greeting"
            }
        ]
    },
    "msg_id": "0f6rvC8mytq0cIY0z"
   }
*
*
* */

const queryBot = (token, text, callback) => {
    if(!token || /^\s*$/.test(token)) {
        return {
            status: "FAILURE",
            reason: "Invalid/No token provided"
        }
    }

    if(!text || /^\s*$/.test(text)) {
        callback({
            status: "FAILURE",
            reason: "Invalid/No intent name provided"
        });
    }

    console.log("Querying " + text);
    request.get({
        "headers": { "content-type": "application/json" ,
            "Authorization": "Bearer " + token},
        "url": "https://api.wit.ai/message?v=20170307&q=" + text
    }, (error, response, body) => {
        if(error) {
            console.log(JSON.stringify(error));
            callback({
                status: "FAILURE",
                reason: error
            });
        }

        if(body) {
            const res = JSON.parse(body);
            console.log(res);
            if(res.entities.intent) {
                callback({
                    status: "SUCCESS",
                    body: res.entities.intent
                });
            } else {
                callback({
                    status: "FAILURE",
                    reason: "Query intent mapping not found or trained"
                });
            }
        } else {
            console.log(JSON.parse(response));
            callback({
                status: "FAILURE",
                reason: response
            });
        }
    });
};

/*Function to delete existing intent
*Sample response:
* {
    "deleted": "byegreeting"
  }
* */
const deleteIntent = (token, intent, callback) => {
    if(!token || /^\s*$/.test(token)) {
        return {
            status: "FAILURE",
            reason: "Invalid/No token provided"
        }
    }

    if(!intent || /^\s*$/.test(intent)) {
        callback({
            status: "FAILURE",
            reason: "Invalid/No intent name provided"
        });
    }
    console.log("Deleting intent " + intent);
    request.delete({
        "headers": { "content-type": "application/json" ,
            "Authorization": "Bearer " + token},
        "url": "https://api.wit.ai/entities/intent/values/" + intent
    }, (error, response, body) => {
        if(error) {
            console.log(JSON.stringify(error));
            callback({
                status: "FAILURE",
                reason: error
            });
        }

        if(body) {
            const res = JSON.parse(body);
            console.log(res);
            if(res.deleted) {
                callback({
                    status: "SUCCESS",
                    body: res
                });
            } else {
                callback({
                    status: "FAILURE",
                    reason: "Query intent mapping not found or trained"
                });
            }
        } else {
            console.log(JSON.parse(response));
            callback({
                status: "FAILURE",
                reason: response
            });
        }
    });
};

/*Function to delete existing intent
*Sample response:
* {
    "deleted": "byegreeting"
  }
* */
const deleteBot = (token, appId, callback) => {
    if(!token || /^\s*$/.test(token)) {
        return {
            status: "FAILURE",
            reason: "Invalid/No token provided"
        }
    }

    if(!appId || /^\s*$/.test(appId)) {
        callback({
            status: "FAILURE",
            reason: "Invalid/No intent name provided"
        });
    }
    console.log("Deleting bot " + appId);
    request.delete({
        "headers": { "content-type": "application/json" ,
            "Authorization": "Bearer " + token},
        "url": "https://api.wit.ai/apps/" + appId
    }, (error, response, body) => {
        if(error) {
            console.log(JSON.stringify(error));
            callback({
                status: "FAILURE",
                reason: error
            });
        }

        if(body) {
            const res = JSON.parse(body);
            console.log(res);
            if(res.success) {
                callback({
                    status: "SUCCESS",
                });
            } else {
                callback({
                    status: "FAILURE",
                    reason: "Failed to delete bot"
                });
            }
        } else {
            console.log(JSON.parse(response));
            callback({
                status: "FAILURE",
                reason: response
            });
        }
    });
};

/*
createBot('VEA6CN4I6UTPMSCZERZYGMFA4NCZBFWV', 'wit_bot', (result) => {
    console.log(JSON.stringify(result));
});

createOrUpdateIntent('56RU2JCICK2XUVEF25EG4CQPJYJZDQAL', 'byeGreeting', ['Bye', 'Adios amigos'],(result) => {
    console.log(JSON.stringify(result));
});

queryBot('VEA6CN4I6UTPMSCZERZYGMFA4NCZBFWV', 'Hi', (result) => {
    console.log(JSON.stringify(result));
});

deleteIntent('VEA6CN4I6UTPMSCZERZYGMFA4NCZBFWV', 'byegreeting', (result) => {
    console.log(JSON.stringify(result));
});


deleteBot('VEA6CN4I6UTPMSCZERZYGMFA4NCZBFWV', '5aeba034-55e9-4d10-b0ff-32bb2d01d931', (result) => {
    console.log(JSON.stringify(result));
});
*/

module.exports = {
    createBot: createBot,
    createOrUpdateIntent: createOrUpdateIntent,
    queryBot: queryBot,
    deleteIntent: deleteIntent,
    deleteBot: deleteBot
}
