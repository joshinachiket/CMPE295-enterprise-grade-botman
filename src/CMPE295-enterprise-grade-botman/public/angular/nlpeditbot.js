var app = angular.module('NlpBotTemplate', []);

app.controller('BotEdit', function($scope, $http, $timeout) {

    // dialog visibility variables
    $scope.showEntityDialogue = false;
    $scope.showResponseDialogue = false;
    $scope.showDeleteIntentDialogue = false;

    /*snack bar object*/
    $scope.updateMappingStatus = {
       success: false,
       error: false
    }

    /** dummy object to store new values **/
    $scope.dummy = {
        newIntent:"",
        newEntity:"",
        newResponse:""
    }

    $scope.bot = {
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
    }

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
        console.log(addIntent_payload);
    }

    $scope.viewEntityDialogue = function(intent) {
        $scope.showEntityDialogue = true;
        $scope.dummy.newIntent = intent;
    }

    $scope.addEntity = function() {
        var botName = localStorage.getItem("botName");
        var addEntity_payload = {
            "bot_name": botName,
            "intent" : $scope.dummy.newIntent,
            "entity" : $scope.dummy.newEntity
        }
        //send this payload to the server to add entity to the Intent.
        console.log(addEntity_payload);
    }

    $scope.viewEditResponse = function(intent) {
        $scope.showResponseDialogue = true;
        $scope.dummy.newIntent = intent;
    }

    $scope.updateResponse = function() {
        var botName = localStorage.getItem("botName");
        var updateResponse_payload = {
            "bot_name": botName,
            "intent" : $scope.dummy.newIntent,
            "response" : $scope.dummy.newResponse
        }
        //send this payload to the server to update the response for an Intent.
        console.log(updateResponse_payload);
    }

    $scope.viewDeleteIntentDialogue = function(intent) {
         $scope.showDeleteIntentDialogue = true;
         $scope.dummy.newIntent = intent;
    }

    $scope.deleteIntent = function(intent) {
        var botName = localStorage.getItem("botName");
        var deleteIntent_payload = {
            "bot_name": botName,
            "intent" : $scope.dummy.newIntent,
        }
        //send this payload to the server to delete an Intent.
        console.log(deleteIntent_payload);
    }
});
