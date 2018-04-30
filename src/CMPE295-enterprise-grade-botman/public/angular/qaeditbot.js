var app = angular.module('QABotTemplate', []);

app.controller('BotEdit', function($scope, $http, $timeout) {
  console.log("Controller loaded");
  //var botName = window.opener.botName;
  var botName = localStorage.getItem("botName");
  console.log(botName);
  $scope.showAddResponseMappingForBot = false;
  $scope.botSayVar = "";
  $scope.userSayVar = "";

  $scope.loadData = function() {

    console.log("ON LOAD GET CALL TO GET BOT MAPPING");
    var getmapping_payload = {
      "bot_name": botName
    };

    $http.get('/user/getBotMapping/' + localStorage.getItem("botName"), {}).then(function(response) {
      if (response.status == 200) {
        console.log("successfully brought data from backend");
        console.log(response.data.bots);
        $scope.bot = response.data.bots;
      } else {
        console.log("something went wrong");
      }
    });
  };

  // $scope.bot = {
  //   id: '23',
  //   name: 'Bot2',
  //   mapping: {
  //     'Hi': 'Hello',
  //     'Are you there': 'Yes! I am listening to you.',
  //     'bye': 'bye',
  //     'What day is today': 'Today is Monday.',
  //     'default': 'Sorry! I dont know that.'
  //   },
  //   unmapped: [
  //     'How old are you?',
  //     'Are you a person?',
  //     'Nice talking to you?',
  //     'What about a coffee?'
  //   ]
  // };
  console.log($scope.bot);

  $scope.updateResponseMapping = function() {
    console.log($scope.userSayVar);
    console.log($scope.botSayVar);


    // //clear variables
    // $scope.userSayVar = "";
    // $scope.botSayVar = "";
    // //Hide dialogue on successful response
    // $scope.showAddResponseMappingForBot = false;
  }

  $scope.removeMapping = function(key) {
    delete $scope.bot.mapping[key];
  }

  $scope.cancelAddResponseDialog = function() {
    $scope.showAddResponseMappingForBot = false;
  }
});