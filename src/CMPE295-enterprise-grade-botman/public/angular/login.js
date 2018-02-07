var app = angular.module('app', []);

app.controller("app", function($scope, $http) {

	$scope.msg_flag = true;

	$scope.submit = function() {
		console.log("login button pressed; your entered credentials are");
		console.log("uname: " + $scope.uname + "password: " + $scope.password);

		if ($scope.uname === "botman" && $scope.password === "teamranjan") {
			window.location = "templates/landingpage.html";
		} else{
			$scope.msg_flag = false;
			console.log("wrong credentials");
		}
	};
});
