var app = angular.module('LandingPage', []);
console.log("landingpage.js angular Connected");

app.controller('BotInfo', function($scope, $http) {
  console.log("BotInfo on page load controller connected");
  $scope.showDialogueDeleteBot = false;
  $scope.deleteBotWithId = -1;
  $scope.botList = [];

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
    //apply null check validation and only send request if valid.
    var createbot_payload = {
      "bot_type": $scope.createBotPayload.botType,
      "bot_name": $scope.createBotPayload.botName
    }
    console.log(createbot_payload);

    $http({
      method: "POST",
      url: '/user/createUserBot',
      data: createbot_payload
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log(response);
      if (response.data.statusCode === 200) {
        console.log("bot successfully created");
        $scope.createbot_status = 1;
      } else if (response.data.statusCode === 401) {
        console.log("invalid entry received");
        $scope.createbot_status = 2;
      } else {
        console.log("bot already exists");
        $scope.createbot_status = 3;
      }

    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

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
