var app = angular.module('LandingPage', []);
console.log("landingpage.js angular Connected");

app.controller('BotInfo', function($scope, $http) {
  console.log("BotInfo on page load controller connected");
  $scope.showDialogueDeleteBot = false;
  $scope.deleteBotWithId = -1;
  $scope.botList = [];

  $scope.loadData = function() {
    console.log("ON LOAD FUNCTION CALLED");
    console.log("get call to get the list of all bot list");

    $http.get('/user/getUserBotList', {}).then(function(response) {
      if (response.status == 200) {
        console.log("successfully brought data from backend");
        console.log(response);
        // $scope.botList = response;
      } else {
        console.log("something went wrong");
      }
    });

    $scope.botList = [{
        botId: 1,
        "name": "Max Joe",
        "lastEdit": "29 Sep,2017",
        "type": "QA"
      },
      {
        botId: 2,
        "name": "Max Joe",
        "lastEdit": "29 Sep,2017",
        "type": "NLP"
      },
      {
        botId: 3,
        "name": "Max Joe",
        "lastEdit": "29 Sep,2017",
        "type": "NLP"
      },
      {
        botId: 4,
        "name": "Max Joe",
        "lastEdit": "29 Sep,2017",
        "type": "QA"
      }
    ];
  };


  $scope.cancelRequestDeleteBot = function() {
    $scope.showDialogueDeleteBot = false;
    $scope.deleteBotWithId = -1;
  }

  $scope.deleteBot = function(bId) {
    var li = $scope.botList;
    for (i = 0; i < li.length; i++) {
      if (li[i].botId === bId) {
        $scope.deleteBotWithName = li[i].name;
        $scope.deleteBotWithId = li[i].botId;
        $scope.showDialogueDeleteBot = true;
      }
    }
  }

  $scope.sendRequestDeleteBot = function() {
    if ($scope.deleteBotWithId > 0) {
      //send request
    }
  }

  $scope.sendRequestEditBot = function(bId) {
    console.log(bId);
  }
});
