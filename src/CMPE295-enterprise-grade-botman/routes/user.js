// include the express router
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var mongo = require('./../database/mongodb');
var mongoURL = "mongodb://admin:cmpe295b@ds231589.mlab.com:31589/cmpe295-enterprise-grade-botman";

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
      console.log(json_response);
      res.send(json_response);
    });

  });

});

router.post('/createUserBot', function(req, res, next) {
  var botCreatePayload = {
    "username": req.session.username,
    "bot_type": req.body.bot_type,
    "bot_name": req.body.bot_name
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
          botType: botCreatePayload.bot_type
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

module.exports = router;
