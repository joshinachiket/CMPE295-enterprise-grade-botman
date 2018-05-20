// include the express router
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
const witai = require('./../nlp_integration/witai');
var fs = require('fs');
var child_process = require('child_process');
var cmd = require('node-cmd');



var mongo = require('./../database/mongodb');
var mongoURL = "mongodb://admin:cmpe295b@ds231589.mlab.com:31589/cmpe295-enterprise-grade-botman";


router.post('/removeSimpleUserBotMapping', function(req, res, next) {
  var deleteMappingPayload = {
    "username": req.session.username,
    "bot_name": req.body.bot_name,
    "userSay": req.body.userSay,
    "botRespond": req.body.botRespond
  };
  console.log("remove bot payload");
  console.log(deleteMappingPayload);

  // add bot information to MongoDB collection named UserBotMetadata
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API removeSimpleUserBotMapping");

    // find collection to insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");
    var json_response;

    collection_botmetadata.update({
      botOwner: deleteMappingPayload.username,
      botName: deleteMappingPayload.bot_name,
    }, {
      "$pull": {
        "mapping": {
          userSay: deleteMappingPayload.userSay,
          botRespond: deleteMappingPayload.botRespond
        }
      }

    }, function(err, response) {
      if (response) {
        console.log("remove successfull, botinfo updated");
        json_response = {
          "statusCode": 200
        };
        res.send(json_response);
      } else {
        console.log("update failure, please check");
        json_response = {
          "statusCode": 401
        }
        res.send(json_response);
      }
    });
  });
});

router.post('/updateSimpleUserBotMapping', function(req, res, next) {
  var botUpdatePayload = {
    "username": req.session.username,
    "bot_name": req.body.bot_name,
    "userQuery": req.body.userQuery,
    "botResponse": req.body.botResponse
  };
  console.log("update bot payload");
  // console.log(botUpdatePayload);

  // add bot information to MongoDB collection named UserBotMetadata
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API updateUserBot");
    // find collection to insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");
    var json_response;

    collection_botmetadata.update({
      botOwner: botUpdatePayload.username,
      botName: botUpdatePayload.bot_name,
    }, {
      "$push": {
        "mapping": {
          "userSay": botUpdatePayload.userQuery,
          "botRespond": botUpdatePayload.botResponse
        }
      }
    }, function(err, response) {
      if (response) {
        console.log("update successfull, botinfo updated");
        collection_botmetadata.update(
            {
                botOwner: botUpdatePayload.username,
                botName: botUpdatePayload.bot_name,
            },
            {
                "$pull": {
                    unmapped : { $in : [ botUpdatePayload.userQuery ] }
                }
            }, function (err, response) {
                json_response = {
                  "statusCode": 200
                };
                res.send(json_response);
          });
      } else {
        console.log("update failure, please check");
        json_response = {
          "statusCode": 401
        }
        res.send(json_response);
      }
    });
  });
});



router.get('/getBotMapping/:botname', function(req, res) {
  // bring all the bot information of user from mongodb to front end
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API user/getBotMapping");
    // find collectionto insert the database
    var collection_botmetadata = mongo.collection('UserBotMetadata');
    var json_response;

    collection_botmetadata.find({
      botOwner: req.session.username,
      botName: req.params.botname
    }, {}).toArray(function(err, data) {

      json_response = {
        "bots": data,
        "statusCode": 200
      };
      // console.log(json_response);
      res.send(json_response);
    });

  });

});


router.get('/getUserBotList', function(req, res) {
  var username = req.session.username;
  console.log(username);

  // bring all the bot information of user from mongodb to front end
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API user/getUserBotList");
    // find collectionto insert the database
    var collection_botmetadata = mongo.collection('UserBotMetadata');
    var json_response;

    collection_botmetadata.find({
      botOwner: username
    }).toArray(function(err, data) {

      json_response = {
        "bots": data,
        "statusCode": 200
      };
      // console.log(json_response);
      res.send(json_response);
    });

  });

});

router.post('/createUserBot', function(req, res, next) {
  var botCreatePayload = {
    "username": req.session.username,
    "bot_type": req.body.bot_type,
    "bot_name": req.body.bot_name,
    "nlp_token": req.body.nlp_token
  };

  console.log("create bot payload");
  console.log(botCreatePayload);

  // add bot information to MongoDB collection named UserBotMetadata
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API createUserBot");
    // find collection to insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");
    var json_response;

    collection_botmetadata.findOne({
      botName: req.body.bot_name
    }, function(err, response) {
      if (response) {
        console.log("BOT WITH THIS NAME ALREADY EXISTS");
        res.send({
          "statusCode": 402
        });
      } else {
        if (botCreatePayload.bot_type === "nlp_bot") {
          witai.createBot(botCreatePayload.nlp_token, botCreatePayload.bot_name, (response) => {
            console.log("Creating witai bot response " + JSON.stringify(response));
            if (response.status === "SUCCESS") {
              collection_botmetadata.insert({
                botOwner: botCreatePayload.username,
                // botId: getNextSequenceValue("botId"),
                botName: botCreatePayload.bot_name,
                lastEdit: new Date(),
                currentEdit: new Date(),
                botType: botCreatePayload.bot_type,
                nlpToken: response.body.access_token,
                appId: response.body.app_id,
                mapping: [],
                unmapped: []
              }, function(err, response) {
                if (response) {
                  console.log("insert successful, botinfo inserted");
                  json_response = {
                    "statusCode": 200
                  };
                  res.send(json_response);
                } else {
                  console.log("insert failure, please check");
                  json_response = {
                    "statusCode": 401
                  }
                  res.send(json_response);
                }
              });
            } else {
              console.log("insert failure, please check");
              res.send({
                "statusCode": 401
              });
            }
          });
        } else {
          collection_botmetadata.insert({
            botOwner: botCreatePayload.username,
            // botId: getNextSequenceValue("botId"),
            botName: botCreatePayload.bot_name,
            lastEdit: new Date(),
            currentEdit: new Date(),
            botType: botCreatePayload.bot_type,
            nlpToken: botCreatePayload.nlp_token,
            mapping: [],
            unmapped: []
          }, function(err, response) {
            if (response) {
              console.log("insert successful, botinfo inserted");
              json_response = {
                "statusCode": 200
              };
              res.send(json_response);
            } else {
              console.log("insert failure, please check");
              res.send({
                "statusCode": 401
              });
            }
          });
        }
      }
    });
  });
});

router.post('/deleteUserBot', function(req, res, next) {

  var bId = req.body.bid;
  console.log("delete bot payload");
  console.log(bId);
  var collection_botmetadata = mongo.collection('UserBotMetadata');
  collection_botmetadata.findOne({
    _id: ObjectId(bId)
  }, function(err, botMetadata) {
    if (err) {
      console.log("Failed to fetch bot information");
      res.send({
        "statusCode": 402
      });
    } else {
      if (botMetadata.botType === "nlp_bot") {
        witai.deleteBot(botMetadata.nlpToken, botMetadata.appId, (result) => {
          if (result.status === "SUCCESS") {
            mongo.connect(mongoURL, function() {
              console.log("inside mongo connection function of API deleteUserBot");
              var collection_botmetadata = mongo.collection("UserBotMetadata");
              var json_response;

              collection_botmetadata.deleteOne({
                _id: {
                  $eq: ObjectId(bId)
                }
              }, function(err, response) {
                if (response) {
                  json_response = {
                    "statusCode": 200
                  };
                  console.log(json_response);
                  res.send(json_response);
                }
              });
            });
          } else {
            res.send({
              "statusCode": 401
            });
          }
        });
      } else {
        mongo.connect(mongoURL, function() {
          console.log("inside mongo connection function of API deleteUserBot");
          var collection_botmetadata = mongo.collection("UserBotMetadata");
          var json_response;

          collection_botmetadata.deleteOne({
            _id: {
              $eq: ObjectId(bId)
            }
          }, function(err, response) {
            if (response) {
              json_response = {
                "statusCode": 200
              };
              console.log(json_response);
              res.send(json_response);
            }
          });
        });
      }
    }
  });
});


/**
 Url request mapping for NLP bot.
 **/

/**
 * Add New Intent.
 * payload:
 *
 *  "bot_name": botName,
 "intent"  : $scope.dummy.newIntent,
 "entity"  : $scope.dummy.newEntity,
 "response": $scope.dummy.newResponse
 */

router.post('/updateNLPUserBotMapping/addIntent', function(req, res, next) {

  var botAddIntentPayload = {
    "username": req.session.username,
    "bot_name": req.body.bot_name,
    "intent": req.body.intent,
    "entity": req.body.entity,
    "response": req.body.response
  };

  console.log("Add intent bot payload");
  console.log(botAddIntentPayload);

  // add bot information to MongoDB collection named UserBotMetadata
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API updateUserBot");
    // find collection to insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");

    collection_botmetadata.findOne({
      botOwner: botAddIntentPayload.username,
      botName: botAddIntentPayload.bot_name
    }, function(err, botMetadata) {
      if (err) {
        console.log("Failed to fetch user bot");
        res.send({
          "statusCode": 401
        });
      } else {
        witai.createOrUpdateIntent(botMetadata.nlpToken, botAddIntentPayload.intent, [botAddIntentPayload.entity], (result) => {
          if (result.status === 'SUCCESS') {
            collection_botmetadata.update({
              botOwner: botAddIntentPayload.username,
              botName: botAddIntentPayload.bot_name,
            }, {
              "$push": {
                "mapping": {
                  "intent": botAddIntentPayload.intent,
                  "entity": [botAddIntentPayload.entity],
                  "response": botAddIntentPayload.response
                }
              }

            }, function(err, response) {
                collection_botmetadata.update(
                    {
                        botOwner: botAddIntentPayload.username,
                        botName: botAddIntentPayload.bot_name,
                    },
                    {
                        "$pull": {
                            unmapped : { $in : [ botAddIntentPayload.entity ] }
                        }
                    });
              if (response) {
                console.log("indent added successful, bot info updated");
                res.send({
                  "statusCode": 200
                });
              } else {
                console.log("indent added failure, please check");
                res.send({
                  "statusCode": 401
                });
              }
            });
          } else {
            console.log("indent added failure, please check");
            res.send({
              "statusCode": 401
            });
          }
        });
      }
    });
  });
});

/**
 * Delete Intent.
 */
router.delete('/bot/:botName/intent/:intent', function(req, res, next) {

  console.log("Deleting intent " + req.params.intent + " for bot " + req.params.botName + " of user " + req.session.username);

  // add bot information to MongoDB collection named UserBotMetadata
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API delete intent");
    // find collection to insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");

    collection_botmetadata.findOne({
      botOwner: req.session.username,
      botName: req.params.botName
    }, function(err, botMetadata) {
      if (err) {
        res.send({
          "statusCode": 401
        });
      } else {
        witai.deleteIntent(botMetadata.nlpToken, req.params.intent, (result) => {
          if (result.status === 'SUCCESS') {
            collection_botmetadata.update({
              botOwner: req.session.username,
              botName: req.params.botName
            }, {
              "$pull": {
                "mapping": {
                  "intent": req.params.intent
                }
              }

            }, function(err, response) {
              if (response) {
                console.log("update successful, bot info updated");
                res.send({
                  "statusCode": 200
                });
              } else {
                console.log("update failure, please check");
                res.send({
                  "statusCode": 401
                });
              }
            });
          } else {
            res.send({
              "statusCode": 401
            });
          }
        });
      }

    });
  });
});


/**
 * Add Entity.
 */
router.post('/bot/:botName/intent/:intent/:entity', function(req, res, next) {

  console.log("Adding entity " + req.params.entity + " for intent " + req.params.intent + " of bot " + req.params.botName + " of user " + req.session.username);

  // add bot information to MongoDB collection named UserBotMetadata
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API add entity");
    // find collection to insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");
    let queries = [];

    collection_botmetadata.findOne({
      "botOwner": req.session.username,
      "botName": req.params.botName
    }, function(err, botMetadata) {
      console.log(botMetadata);
      console.log(botMetadata.mapping);
      //Remove Entity from mapping if exist.
      let unMapped = botMetadata.unmapped;
      unMapped.splice(unMapped.indexOf(req.params.entity),1);
      let thisMapping = botMetadata.mapping;
      for (var i = 0; i < thisMapping.length; i++) {
        if (thisMapping[i].intent === req.params.intent) {
          console.log("Found intent to update");
          thisMapping[i].entity.push(req.params.entity);
          console.log(thisMapping);
          queries = thisMapping[i].entity;
          break;
        }
      }
      console.log(thisMapping);
      console.log(thisMapping.entity);


      witai.createOrUpdateIntent(botMetadata.nlpToken, req.params.intent, queries, (result) => {
        if (result.status === 'SUCCESS') {
          collection_botmetadata.update({
            botOwner: req.session.username,
            botName: req.params.botName
          }, {
            "$set": {
              "mapping": thisMapping,
              "unmapped" : unMapped
            }

          }, function(err, response) {
            if (response) {
              console.log("update successful, bot info updated");
              res.send({
                "statusCode": 200
              });
            } else {
              console.log("update failure, please check");
              res.send({
                "statusCode": 401
              });
            }
          });
        } else {
          console.log("update failure, please check");
          res.send({
            "statusCode": 401
          });
        }
      });
    });
  });
});


/**
 * Update Intent Response.
 */
router.put('/bot/:botName/intent/:intent/:response', function(req, res, next) {

  console.log("Updating response for intent " + req.params.intent + " for bot " + req.params.botName + " of user " + req.session.username);

  // add bot information to MongoDB collection named UserBotMetadata
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API delete intent");
    // find collection to insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");
    var json_response;

    collection_botmetadata.updateOne({
      botOwner: req.session.username,
      botName: req.params.botName,
      "mapping.intent": req.params.intent
    }, {
      "$set": {
        "mapping.$.response": req.params.response
      }


    }, function(err, response) {
      if (response) {
        console.log("update successful, bot info updated");
        json_response = {
          "statusCode": 200
        };
        res.send(json_response);
      } else {
        console.log("update failure, please check");
        json_response = {
          "statusCode": 401
        }
        res.send(json_response);
      }
    });
  });
});


function createBotConfigFile(path, data, host, cb) {
  var filePath = path + '/bot_config.json';

  console.log("localhost addresss: " + host);

  var config = {};
  config['username'] = data.botOwner;
  config['botname'] = data.botName;
  config['server_ip'] = 'http://8e8cca35.ngrok.io';//host;
  config['token'] = data.nlpToken;
  config['responseConfig'] = {};
  if (data.botType === 'simple_bot') {
    data.mapping.forEach(function(map) {
      config['responseConfig'][map.userSay] = map.botRespond;
    });
    fs.writeFile(filePath, JSON.stringify(config), 'utf8', function(err) {
      if (err) {
        console.log(err);
        cb(false);
      }
      cb(true);
    });
  } else {
    console.log(data.mapping);
    data.mapping.forEach(function(map) {
      console.log(map);
      config['responseConfig'][map.intent] = map.response;
    });
    console.log(config);
    fs.writeFile(filePath, JSON.stringify(config), 'utf8', function(err) {
      if (err) {
        console.log(err);
        cb(false);
      }
      cb(true);
    });

  }
}

/**
 * Upload bot to server
 */
router.post('/bot/:botName/upload', function(req, res, next) {
  var payload = {
    "userName": req.session.username,
    "botName": req.params.botName
  }
  console.log("Upload :" + payload.botName + " for User: " + payload.userName);
  mongo.connect(mongoURL, function() {
    json_response = {
      "statusCode": 200
    }
    var collection_botmetadata = mongo.collection("UserBotMetadata");
    var query = {
      "botOwner": payload.userName,
      "botName": payload.botName
    }
    collection_botmetadata.findOne(query, function(err, data) {
      if (err) {
        json_response.statusCode = 401;
        res.send(json_response);
        return;
      }
      var path = './bot_template/';
      if (data.botType === 'simple_bot') {
        path = path + 'QABotTemplate';
      } else {
        path = path + 'NLPBotTemplate';
      }

      path = path + '/bot';
      var host = req.connection.localAddress;
      host = host.substring(7) + ":" + req.connection.localPort;

      createBotConfigFile(path, data, host, function(success) {
        if (!success) {
          console.log("Failed to create file bot_config.json for " + payload.userName);
          json_response.statusCode = 401;
          res.send(json_response);
          return;
        }
        //Run the Upload script get status and give it to the frontend.
        // upload to heroku here nachiket
        var heroku_dir_name = (payload.userName + '-' + payload.botName).toLowerCase();
        console.log(heroku_dir_name);
        var batch_path = __dirname + '/../batch/';

        child_process.exec(batch_path + '/createHerokuDirectory.bat ' + heroku_dir_name,
          function(error, stdout, stderr) {
            console.log("CREATING A HEROKU DIRECTORY");
            console.log(stdout);

            child_process.exec(batch_path + 'makeHerokuDirectoryMaster.bat ' + path + " " + heroku_dir_name,
              function(error, stdout, stderr) {
                console.log("MAKING A HEROKU DIRECTORY MASTER");
                console.log(stdout);

                child_process.exec(batch_path + 'createYourBot.bat ' + path,
                  function(error, stdout, stderr) {
                    console.log('Deploying to the cloud');
                    console.log(stdout);
                    var deployed_path = "https://" + heroku_dir_name + ".herokuapp.com";
                    json_responses = {
                      "statusCode": 200,
                      "deployed_path": deployed_path
                    };
                    console.log(json_responses);
                    res.send(json_responses);
                  });

                // res.send(json_responses);
              });
            // res.send(json_responses);
          });

        // res.send(json_response);
      });
    });
  });
});

module.exports = router;