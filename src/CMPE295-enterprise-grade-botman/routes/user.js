// include the express router
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;


var mongo = require('./../database/mongodb');
var mongoURL = "mongodb://admin:cmpe295b@ds231589.mlab.com:31589/cmpe295-enterprise-grade-botman";


router.post('/removeSimpleUserBotMapping', function(req, res, next) {
  var deletebotPayload = {
    "username": req.session.username,
    "bot_name": req.body.bot_name,
    "mapping_number": req.body.mapping_number
  };
  console.log("remove bot payload");
  console.log(deletebotPayload);

  // add bot information to MongoDB collection named UserBotMetadata
  mongo.connect(mongoURL, function() {
    console.log("inside mongo connection function of API removeSimpleUserBotMapping");
    // find collectionto insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");
    var json_response;

    collection_botmetadata.update({
      botOwner: botUpdatePayload.username,
      botName: botUpdatePayload.bot_name,
    }, {
      "$pull": {
        "mapping": {
          [botUpdatePayload.userQuery]: botUpdatePayload.botResponse
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
    // find collectionto insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");
    var json_response;

    collection_botmetadata.update({
      botOwner: botUpdatePayload.username,
      botName: botUpdatePayload.bot_name,
    }, {
      "$push": {
        "mapping": {
          [botUpdatePayload.userQuery]: botUpdatePayload.botResponse
        }
      }

    }, function(err, response) {
      if (response) {
        console.log("update successfull, botinfo updated");
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
    // find collectionto insert the database
    var collection_botmetadata = mongo.collection("UserBotMetadata");
    var json_response;

    collection_botmetadata.findOne({
      botName: req.body.bot_name
    }, function(err, response) {
      if (response) {
        console.log("BOT WITH THIS NAME ALREADY EXISTS");

        json_responses = {
          "statusCode": 402
        };
        res.send(json_responses);
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
            console.log("insert successfull, botinfo inserted");
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
      }
    });
  });
});

router.post('/deleteUserBot', function(req, res, next) {

  var bId = req.body.bid;
  console.log("delete bot payload");
  console.log(bId);

  // add bot information to MongoDB collection named UserBotMetadata
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
        // find collectionto insert the database
        var collection_botmetadata = mongo.collection("UserBotMetadata");
        var json_response;

        collection_botmetadata.update({
            botOwner: botAddIntentPayload.username,
            botName: botAddIntentPayload.bot_name,
        }, {
            "$push": {
                "mapping": {
                    "intent" : botAddIntentPayload.intent,
                    "entity": [botAddIntentPayload.entity],
                    "response": botAddIntentPayload.response
                }
            }

        }, function(err, response) {
            if (response) {
                console.log("update successfull, botinfo updated");
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


/**
 * Delete Intent
 * payload:
 *
 *
 */
module.exports = router;