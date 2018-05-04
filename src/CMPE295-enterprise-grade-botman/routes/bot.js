// include the express router
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;


var mongo = require('./../database/mongodb');
var mongoURL = "mongodb://admin:cmpe295b@ds231589.mlab.com:31589/cmpe295-enterprise-grade-botman";


/**
 * Add question to Unmapped array of bot.
 */
router.put('/:botName/unmapped', function(req, res, next) {

    console.log(req.body.userName+" : "+req.body.unmappedQue);
    var payload = {
        "userName" : req.body.userName,
        "botName": req.params.botName,
        "unmappedQue": req.body.unmappedQue
    }
    console.log(payload);
    mongo.connect(mongoURL, function() {
        console.log("inside mongo connection function of API delete intent");

        var collection_botmetadata = mongo.collection("UserBotMetadata");
        var json_response;

        collection_botmetadata.updateOne({
            botOwner: payload.userName,
            botName: payload.botName
        }, {
            "$addToSet": {
               unmapped : payload.unmappedQue
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

module.exports = router;