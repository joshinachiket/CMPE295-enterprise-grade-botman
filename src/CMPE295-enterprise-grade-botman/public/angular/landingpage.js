var app = angular.module('LandingPage', []);
console.log("landingpage.js angular Connected");

app.controller('BotInfo', function($scope, $http) {
  console.log("BotInfo on page load controller connected");
  $scope.showDialogueDeleteBot = false;
  $scope.deleteBotWithId = -1;
  $scope.botList = [];

  // create bot payload
  $scope.createBotPayload = {
    "botName": "",
    "botType": ""
  };

  $scope.loadData = function() {
    console.log("ON LOAD FUNCTION CALLED");
    $http.get('/user/getUserBotList', {}).then(function(response) {
      if (response.status == 200) {
        console.log("successfully brought data from backend");
        $scope.botList = response.data.bots;
      } else {
        console.log("something went wrong");
      }
    });
  };

  $scope.createBot = function() {
    console.log("create button pressed with create payload as follows");
    console.log($scope.createBotPayload);
    //apply null check validation and only send request if valid.

  };


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
      console.log($scope.deleteBotWithId);
      $scope.showDialogueDeleteBot = false;
    }
  }
  $scope.cancelRequestDeleteBot = function() {
     $scope.showDialogueDeleteBot = false;
     $scope.deleteBotWithId = -1;
  }

  $scope.sendRequestEditBot = function(bId) {
    console.log(bId);
  }
});
