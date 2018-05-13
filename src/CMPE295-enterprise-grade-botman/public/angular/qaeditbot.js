var app = angular.module('QABotTemplate', []);

app.controller('BotEdit', function($scope, $http, $timeout) {

  console.log("Controller loaded");
  console.log(localStorage.getItem("botName"));

  $scope.showAddResponseMappingForBot = false;
  $scope.showUploadBotDialogue = false;
  $scope.botSayVar = "";
  $scope.userSayVar = "";
  $scope.disableButton = false;
  $scope.accessUrl="";

  /*snack bar object*/
  $scope.updateMappingStatus = {
    success: false,
    error: false
  }

  $scope.uploadBotStatus = {
      success: false,
      error: false
  }

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

  $scope.updateResponseMapping = function() {
    console.log($scope.userSayVar);
    console.log($scope.botSayVar);

    var botName = localStorage.getItem("botName");
    var updatebot_payload = {
      "userQuery": $scope.userSayVar,
      "botResponse": $scope.botSayVar,
      "bot_name": botName
    }
    console.log(updatebot_payload);

    $http({
      method: "POST",
      url: '/user/updateSimpleUserBotMapping',
      data: updatebot_payload
    }).then(function successCallback(response) {
      console.log(response);
      if (response.data.statusCode === 200) {
        console.log("bot successfully updated");
        $scope.updateMappingStatus.success = true;
        $scope.updateMappingStatus.error = false;
      } else {
        console.log("Error updating bot");
        $scope.updateMappingStatus.error = true;
        $scope.updateMappingStatus.success = false;
      }
    }, function errorCallback(response) {
      $scope.updateMappingStatus.error = true;
      $scope.updateMappingStatus.success = false;
    });
    $timeout(function() {
      $scope.loadData();
      //clear variables
      $scope.userSayVar = "";
      $scope.botSayVar = "";
      $scope.showAddResponseMappingForBot = false;
      $scope.updateMappingStatus.error = false;
      $scope.updateMappingStatus.success = false;
    }, 5000);
  };

  $scope.removeMapping = function(userSay, botRespond) {
    var botName = localStorage.getItem("botName");
    var deletebot_payload = {
        "bot_name": botName,
        "userSay": userSay,
        "botRespond": botRespond
    }
    console.log(deletebot_payload);
    $http({
      method: "POST",
      url: '/user/removeSimpleUserBotMapping',
      data: deletebot_payload
    }).then(function successCallback(response) {
      console.log(response);
      if (response.data.statusCode === 200) {
        console.log("botmapping successfully removed");
      } else {
        console.log("Error removing botmapping");
      }
      $scope.loadData();
    }, function errorCallback(response) {});
  }

  $scope.cancelAddResponseDialog = function() {
    $scope.showAddResponseMappingForBot = false;
  }

  $scope.goBack = function() {
    console.log('Here');
    window.history.back();
  }

    $scope.cancelUpload = function () {
        $scope.showUploadBotDialogue=false;
        $scope.uploadBotStatus.error = false;
        $scope.uploadBotStatus.success = false;
        $scope.disableButton = false;
        $scope.accessUrl="";
    }

    $scope.uploadBot= function() {
        $scope.disableButton = true;
        var botName = localStorage.getItem("botName");
        console.log('Upload Bot.');
        $http({
            method: "POST",
            url: '/user/bot/'+botName+'/upload'
        }).then(function successCallback(response) {
            console.log(response);
            if (response.data.statusCode === 200) {
                console.log("botmapping successfully uploaded.");
                $scope.accessUrl = '<iframe src="' + response.data.deployed_path + '/bot" height="390" width="407" style="position:fixed;bottom:0;right:0;z-index:10;"></iframe>';
                $scope.uploadBotStatus.success = true;
            } else {
                console.log("Error uploading bot.");
                $scope.uploadBotStatus.error = true;
            }
        }, function errorCallback(response) {
            $scope.uploadBotStatus.error = true;
            $timeout(function() {
                $scope.showUploadBotDialogue = false;
                $scope.uploadBotStatus.error = false;
                $scope.uploadBotStatus.success = false;
                $scope.disableButton = false;
                $scope.accessUrl="";
            }, 3000);
        });
    }
});