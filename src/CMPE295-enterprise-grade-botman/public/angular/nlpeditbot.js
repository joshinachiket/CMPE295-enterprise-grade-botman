var app = angular.module('NlpBotTemplate', []);

app.controller('BotEdit', function($scope, $http, $timeout) {

    // dialog visibility variables
    $scope.showAddNewIntentDialogue = false;
    $scope.addEntityDialogue = false;
    $scope.showResponseDialogue = false;
    $scope.showDeleteIntentDialogue = false;
    $scope.showUploadBotDialogue = false;

    /*snack bar object*/
    $scope.updateMappingAddIntentStatus = {
       success: false,
       error: false
    }
    $scope.updateMappingUpdateResponseStatus = {
        success: false,
        error: false
    }
    $scope.updateMappingDeleteIntentStatus = {
        success: false,
        error: false
    }
    $scope.updateMappingAddEntityStatus = {
        success: false,
        error: false
    }
    $scope.uploadBotStatus = {
        success: false,
        error: false
    }


    /** dummy object to store new values **/
    $scope.dummy = {
        newIntent:"",
        newEntity:"",
        newResponse:""
    }

    /*$scope.bot = {
        id:'23',
        name: 'Bot2',
        mapping: [
            {
                intent : 'greeting',
                entity : ['Hey! Whats up?','How are you?','How you doing?'],
                response : 'I am doing Great.'
            },{
                intent : 'location',
                entity : ['Where are you?','Where do u live?'],
                response : 'I am at San Jose.'
            },{
                intent : 'see of',
                entity : ['I will take you leave.','See you then.','Good bye.'],
                response : 'Have a great day ahead.'
            }
        ],
        unmapped:[
            'How old are you?',
            'Are you a person?',
            'Nice talking to you?',
            'What about a coffee?'
        ]
    }*/

    $scope.loadData = function() {
        var botName = localStorage.getItem("botName");
        console.log("ON LOAD GET CALL TO GET BOT MAPPING");
        var getmapping_payload = {
            "bot_name": botName
        };

        $http.get('/user/getBotMapping/' + localStorage.getItem("botName"), {}).then(function(response) {
            if (response.status == 200) {
                console.log("successfully brought data from backend");
                console.log(response.data.bots[0]);
                $scope.bot = response.data.bots[0];
            } else {
                console.log("something went wrong");
            }
        });
    };

    $scope.toggle = false;
    $scope.toggleFilter = function() {
        this.toggle = !this.toggle;
    };


    $scope.addIntent = function (intent, entity, response) {
        var botName = localStorage.getItem("botName");
        var addIntent_payload = {
            "bot_name": botName,
            "intent" : $scope.dummy.newIntent,
            "entity" : $scope.dummy.newEntity,
            "response": $scope.dummy.newResponse
        }
        //send this payload to the server to create new Intent.
        $http({
            method: "POST",
            url: '/user/updateNLPUserBotMapping/addIntent',
            data: addIntent_payload
        }).then(function successCallback(response) {
            console.log(response);
            if (response.data.statusCode === 200) {
                console.log("bot successfully updated");
                $scope.updateMappingAddIntentStatus.success = true;
                $scope.updateMappingAddIntentStatus.error = false;
            } else {
                console.log("Error updating bot");
                $scope.updateMappingAddIntentStatus.error = true;
                $scope.updateMappingAddIntentStatus.success = false;
            }
        }, function errorCallback(response) {
            $scope.updateMappingAddIntentStatus.error = true;
            $scope.updateMappingAddIntentStatus.success = false;
        });
        $timeout(function() {
            $scope.loadData();
            //clear variables
            $scope.dummy.newIntent = "";
            $scope.dummy.newEntity = "";
            $scope.dummy.newResponse = "";
            $scope.showAddNewIntentDialogue = false;
            $scope.updateMappingAddIntentStatus.error = false;
            $scope.updateMappingAddIntentStatus.success = false;
        }, 5000);
    }

    $scope.viewEntityDialogue = function(intent) {
        $scope.addEntityDialogue = true;
        $scope.dummy.newIntent = intent;
    }

    $scope.addEntity = function() {
        var botName = localStorage.getItem("botName");
        var addEntity_payload = {
            "bot_name": botName,
            "intent": $scope.dummy.newIntent,
            "entity": $scope.dummy.newEntity
        }
        //send this payload to the server to add entity to the Intent.
        $http({
            method: "POST",
            url: "/user/bot/" + botName + "/intent/" + $scope.dummy.newIntent + "/" + $scope.dummy.newEntity,
        }).then(function successCallback(response) {
            console.log(response);
            if (response.data.statusCode === 200) {
                console.log("bot successfully updated");
                $scope.updateMappingAddEntityStatus.success = true;
                $scope.updateMappingAddEntityStatus.error = false;
            } else {
                console.log("Error updating bot");
                $scope.updateMappingAddEntityStatus.error = true;
                $scope.updateMappingAddEntityStatus.success = false;
            }
        }, function errorCallback(response) {
            $scope.updateMappingAddEntityStatus.error = true;
            $scope.updateMappingAddEntityStatus.success = false;
        });
        $timeout(function () {
            $scope.loadData();
            //clear variables
            $scope.dummy.newIntent = "";
            $scope.dummy.newEntity = "";
            $scope.dummy.newResponse = "";
            $scope.addEntityDialogue = false;
            $scope.updateMappingAddEntityStatus.error = false;
            $scope.updateMappingAddEntityStatus.success = false;
        }, 5000);
    }

    $scope.viewEditResponse = function(intent) {
        $scope.showResponseDialogue = true;
        $scope.dummy.newIntent = intent;
    }

    $scope.updateResponse = function() {
        var botName = localStorage.getItem("botName");
        //send this payload to the server to update the response for an Intent.
        console.log()
        $http({
            method: "PUT",
            url: "/user/bot/" + botName + "/intent/" + $scope.dummy.newIntent + "/"+ $scope.dummy.newResponse,
        }).then(function successCallback(response) {
            console.log(response);
            if (response.data.statusCode === 200) {
                console.log("bot successfully updated");
                $scope.updateMappingUpdateResponseStatus.success = true;
                $scope.updateMappingUpdateResponseStatus.error = false;
            } else {
                console.log("Error updating bot");
                $scope.updateMappingUpdateResponseStatus.error = true;
                $scope.updateMappingUpdateResponseStatus.success = false;
            }
        }, function errorCallback(response) {
            $scope.updateMappingUpdateResponseStatus.error = true;
            $scope.updateMappingUpdateResponseStatus.success = false;
        });
        $timeout(function() {
            $scope.loadData();
            //clear variables
            $scope.dummy.newIntent = "";
            $scope.dummy.newEntity = "";
            $scope.dummy.newResponse = "";
            $scope.showResponseDialogue = false;
            $scope.updateMappingUpdateResponseStatus.error = false;
            $scope.updateMappingUpdateResponseStatus.success = false;
        }, 5000);
    }

    $scope.viewDeleteIntentDialogue = function(intent) {
         $scope.showDeleteIntentDialogue = true;
         $scope.dummy.newIntent = intent;
    }

    $scope.deleteIntent = function() {
        var botName = localStorage.getItem("botName");
        console.log("/user/bot/" + botName + "/intent/" + $scope.dummy.newIntent);
        //send this payload to the server to create new Intent.
        $http({
            method: "DELETE",
            url: "/user/bot/" + botName + "/intent/" + $scope.dummy.newIntent,
        }).then(function successCallback(response) {
            console.log(response);
            if (response.data.statusCode === 200) {
                console.log("bot successfully updated");
                $scope.updateMappingDeleteIntentStatus.success = true;
                $scope.updateMappingDeleteIntentStatus.error = false;
            } else {
                console.log("Error updating bot");
                $scope.updateMappingDeleteIntentStatus.error = true;
                $scope.updateMappingDeleteIntentStatus.success = false;
            }
        }, function errorCallback(response) {
            $scope.updateMappingDeleteIntentStatus.error = true;
            $scope.updateMappingDeleteIntentStatus.success = false;
        });
        $timeout(function() {
            $scope.loadData();
            //clear variables
            $scope.dummy.newIntent = "";
            $scope.dummy.newEntity = "";
            $scope.dummy.newResponse = "";
            $scope.showDeleteIntentDialogue = false;
            $scope.updateMappingDeleteIntentStatus.error = false;
            $scope.updateMappingDeleteIntentStatus.success = false;
        }, 5000);
    }

    $scope.goBack = function() {
        console.log('Here');
        window.history.back();
    }

    $scope.uploadBot= function() {
        var botName = localStorage.getItem("botName");
        console.log('Upload Bot.');
        $http({
            method: "POST",
            url: '/user/bot/'+botName+'/upload'
        }).then(function successCallback(response) {
            console.log(response);
            if (response.data.statusCode === 200) {
                console.log("botmapping successfully uploaded.");
                $scope.uploadBotStatus.success = true;
            } else {
                console.log("Error uploading bot.");
                $scope.uploadBotStatus.error = true;
            }
            $timeout(function() {
                $scope.showUploadBotDialogue = false;
                $scope.uploadBotStatus.error = false;
                $scope.uploadBotStatus.success = false;
            }, 3000);
        }, function errorCallback(response) {
            $scope.uploadBotStatus.error = true;
            $timeout(function() {
                $scope.showUploadBotDialogue = false;
                $scope.uploadBotStatus.error = false;
                $scope.uploadBotStatus.success = false;
            }, 3000);
        });
    }

});
