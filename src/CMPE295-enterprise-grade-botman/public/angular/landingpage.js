var app = angular.module('LandingPage',[]);
app.controller('BotInfo',function($scope,$http){

    $scope.showDialogueDeleteBot = false;
    $scope.deleteBotWithId =-1;

    //$http.get("")

    $scope.botList =[
        {
            botId:1,
            "name" : "Max Joe",
            "lastEdit" : "29 Sep,2017",
            "type" : "QA"
        },
        {
            botId:2,
            "name" : "Max Joe",
            "lastEdit" : "29 Sep,2017",
            "type" : "NLP"
        },
        {
            botId:3,
            "name" : "Max Joe",
            "lastEdit" : "29 Sep,2017",
            "type" : "NLP"
        },
        {
            botId:4,
            "name" : "Max Joe",
            "lastEdit" : "29 Sep,2017",
            "type" : "QA"
        }
    ];

    $scope.cancelRequestDeleteBot = function () {
        $scope.showDialogueDeleteBot = false;
        $scope.deleteBotWithId = -1;
    }

    $scope.deleteBot = function(bId) {
        var li = $scope.botList;
        for (i = 0; i<li.length; i++) {
            if (li[i].botId===bId) {
                $scope.deleteBotWithName = li[i].name;
                $scope.deleteBotWithId = li[i].botId;
                $scope.showDialogueDeleteBot = true;
            }
        }
    }

    $scope.sendRequestDeleteBot = function() {
        if ($scope.deleteBotWithId>0) {
            //send request
        }
    }

    $scope.sendRequestEditBot = function(bId) {
        console.log(bId);
    }
});
