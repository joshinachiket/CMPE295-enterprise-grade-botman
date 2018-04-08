// include the express router
var express = require('express');
var router = express.Router();

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
      // callback(null, json_response);
    });

  });

});

module.exports = router;

// exports.insertUserMetadata = function(req, res) {
//   var userPayload = {
//      "username" : req.session.username
//    };
//    console.log("hello");
//    console.log(userPayload);
//    console.log(req.session.username);
// }

// router.post('/insertUserMetadata' function(req, res) {
//   var userPayload = {
//     "username" : req.session.username
//   };
//
//   console.log("userMetadate to add");
//   console.log(userPayload);
//
//   // add user data to MongoDB collection named UserMetadata
//   mongo.connect (mongoURL, function() {
//     console.log("inside mongo connection function of API insertUserMetadata");
//     // find collectionto insert the database
//     var collection_usermetadata = mongo.collection("UserMetadata");
//     var json_response;
//     collection_usermetadata.insert({userPayload}, function(err, user) {
//       if (user) {
//         json_response = {
//           "statusCode" : 200
//         };
//         callback(null, json_response);
//       } else {
//         console.log("insert failure, please check");
//         json_response = {
//           "statusCode" : 401
//         }
//         callback(null, json_response);
//       }
//     });
//   });
// });
