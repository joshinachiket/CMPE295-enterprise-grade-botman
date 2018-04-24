var app = angular.module('NlpBotTemplate', []);

app.controller('BotEdit', function($scope, $http, $timeout) {
    console.log("Controller loaded");
    $scope.showAddResponseMappingForBot = true;
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

});
