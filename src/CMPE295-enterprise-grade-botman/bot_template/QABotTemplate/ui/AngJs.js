var app = angular.module('MyApp', []);

app.directive("scrollBottom", function(){
    return {
        link: function(scope, element, attr){
            var $id= $("#" + attr.scrollBottom);
            $(element).on("click", function(){
                $id.scrollTop($id[0].scrollHeight);
            });
        }
    }
});


app.controller('MyController', function($scope, $http) {

    $scope.chat = [];
    $scope.addDiv = function() {
        $scope.chat.push({'type':false, 'message':$scope.userText});
        var update_payload = {
            message : $scope.userText
        }
        $scope.userText = "";
        $http({
            method: 'POST',
            url: '/bot',
            data: update_payload
        }).then(function successCallback(response) {
            console.log(response.data.message);
            $scope.chat.push({
                'type': true,
                'message':response.data.message
            });
        }, function errorCallback(response) {

        });
    }
});