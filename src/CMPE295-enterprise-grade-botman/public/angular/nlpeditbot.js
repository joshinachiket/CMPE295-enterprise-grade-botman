var app = angular.module('NlpBotTemplate', []);

app.controller('BotEdit', function($scope, $http, $timeout) {

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

    $scope.deleteIntent = function(intent) {
        console.log('delete intent:'+intent);
        for (var i = $scope.bot.mapping.length - 1; i >= 0; --i) {
            if ($scope.bot.mapping[i].intent == intent) {
                $scope.bot.mapping.splice(i,1);
            }
        }
    }

    $scope.showEntityDialogue = false;
    $scope.showResponseDialogue = false;

    $scope.addEntity = function(obj) {
        $scope.showEntityDialogue = true;
    }

    $scope.editResponse = function(obj) {
        $scope.showResponseDialogue = true;
    }

});
