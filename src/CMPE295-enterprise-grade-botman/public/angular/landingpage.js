var app = angular.module('LandingPage',[]);
app.controller('BotInfo',function($scope,$http){
    $scope.showDialogueDeleteBot = false;
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

    $scope.editBot = function(bId) {
        console.log(bId);
    }

    $scope.deleteBot = function(bId) {
        console.log(bId);
        for (i = 0; i<botList.length(); i++) {
            if (botList[i].botId===bId) {

            }
        }
        console.log($scope.botList[bId-1]);
    }
});
