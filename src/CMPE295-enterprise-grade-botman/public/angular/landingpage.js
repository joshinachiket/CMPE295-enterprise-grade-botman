var app = angular.module('LandingPage', []);
console.log("landingpage.js angular Connected");

app.controller('BotInfo', function($scope, $http, $timeout) {


  console.log("BotInfo on page load controller connected");
  $scope.deleteBotWithId = -1;

  /*Dialog show-hide variables*/
  $scope.showDialogueDeleteBot = false;
  $scope.showDialogueCreateBot = false;


  /*snack bar object*/
  $scope.deleteRequestStatus = {
    success: false,
    error: false
  }
  $scope.createRequestStatus = {
    success: false,
    error: false
  }

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
      console.log(response);
      if (response.data.statusCode === 200) {
        console.log("bot successfully created");
        $scope.createRequestStatus.error = false;
        $scope.createRequestStatus.success = true;
      } else {
        console.log("Error creating bot");
        $scope.createRequestStatus.error = true;
        $scope.createRequestStatus.success = false;
      }
    }, function errorCallback(response) {
      $scope.createRequestStatus.error = true;
      $scope.createRequestStatus.success = false;
    });
    $timeout(function() {
      $scope.showDialogueCreateBot = false;
      $scope.createRequestStatus.error = false;
      $scope.createRequestStatus.success = false;
      $scope.loadData();
    }, 5000);
  };


  $scope.deleteBot = function(bId, bName) {
    $scope.deleteBotWithId = bId;
    $scope.showDialogueDeleteBot = true;
    $scope.deleteBotWithName = bName;
  }

  $scope.editBot = function(bType) {
    // assign a new depending upon the Type
    if (bType === "nlp_bot") {
      console.log("1. Opening bot template for bot type" + bType);
      window.location = "./templates/nlp_bot_template.html";
    } else if (bType === "simple_bot") {
      console.log("2. Opening bot template for bot type " + bType);
      window.location = "./templates/simple_bot_template.html";
    }
  }

  $scope.sendRequestDeleteBot = function(data) {
    var deletebot_payload = {
      "bid": $scope.deleteBotWithId
    }
    console.log("remove bot info " + deletebot_payload.bid);
    $http({
      method: "POST",
      url: '/user/deleteUserBot',
      data: deletebot_payload
    }).then(function successCallback(response) {
      console.log(response);
      if (response.data.statusCode === 200) {
        console.log("bot successfully deleted");
        $scope.deleteRequestStatus.success = true;
        $scope.deleteRequestStatus.error = false;
      } else {
        $scope.deleteRequestStatus.error = true;
        $scope.deleteRequestStatus.success = false;
      }
    }, function errorCallback(response) {
      $scope.deleteRequestStatus.error = true;
      $scope.deleteRequestStatus.success = false;
    });
    $timeout(function() {
      $scope.showDialogueDeleteBot = false;
      $scope.deleteRequestStatus.error = false;
      $scope.deleteRequestStatus.success = false;
      $scope.loadData();
    }, 5000);
  };

  $scope.sayHi = function() {
    console.log("hi");
  };

  $scope.cancelRequestDeleteBot = function() {
    $scope.showDialogueDeleteBot = false;
    $scope.deleteBotWithId = -1;
  }

  $scope.sendRequestEditBot = function(bId) {
    console.log(bId);
  }
});