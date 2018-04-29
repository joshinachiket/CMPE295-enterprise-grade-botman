var app = angular.module('QABotTemplate', []);

app.controller('BotEdit', function($scope, $http, $timeout) {
    console.log("Controller loaded");
    $scope.showAddResponseMappingForBot = false;
    $scope.botSayVar = "";
    $scope.userSayVar = "";

    $scope.bot = {
        id:'23',
        name: 'Bot2',
        mapping: {
            'Hi':'Hello',
            'Are you there':'Yes! I am listening to you.',
            'bye':'bye',
            'What day is today':'Today is Monday.',
            'default': 'Sorry! I dont know that.'
        },
        unmapped:[
            'How old are you?',
            'Are you a person?',
            'Nice talking to you?',
            'What about a coffee?'
        ]
    }

    $scope.updateResponseMapping = function() {
        console.log($scope.userSayVar);
        console.log($scope.botSayVar);
        $scope.bot.mapping[$scope.userSayVar] = $scope.botSayVar;

        //remove element from unmapped list if exist
        for (var i=$scope.bot.unmapped.length-1; i>=0; i--) {
            if ($scope.bot.unmapped[i] === $scope.userSayVar) {
                $scope.bot.unmapped.splice(i, 1);
            }
        }

        //clear variables
        $scope.userSayVar="";
        $scope.botSayVar="";
        //Hide dialogue
        $scope.showAddResponseMappingForBot = false;
    }

    $scope.removeMapping = function (key) {
       delete $scope.bot.mapping[key];
    }

    $scope.cancelAddResponseDialog = function() {
        $scope.showAddResponseMappingForBot = false;
    }
});
