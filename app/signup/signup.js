var app = angular.module('myApp.signup', ['ngRoute']);

app.controller('SignupCtrl', ['$scope', '$http', function($scope, $http) {
	//$rootScope.menu=false;

	$scope.toLogin = function () {
		window.location.href = '#/login';
	};

	$scope.toSignup = function () {
		window.location.href = '#/signup';
	};

	$scope.doSignup = function () {
		$http({
			method: 'POST',
			url: "http://localhost:8080/signup",
			data: {username: $scope.userName, password: $scope.userPassword, gmail: $scope.userGmail,
				interests:$scope.userInterests }
		}).then(function successCallback(response) {
			//console.log(response);
			if(response.data.message=="Sign up successfully!") {
				var sinchClient = new SinchClient({
					applicationKey: '858acdbb-23ac-4f49-8441-8ca9f69d0236',
					capabilities: {messaging: true},
					startActiveConnection: true,
				});

				var loginObject = {username: $scope.userName, password: $scope.userPassword};

				sinchClient.newUser( loginObject, function(ticket) {
					sinchClient.start(ticket, function() {
						console.log("Since signed up!")
						//$scope.global_username =  $scope.username;
						//$('input#username').val( '');
						//$('input#password').val( '' );
						//  $scope.changeRecipient();
					}).fail();
				}).fail();
				window.location.href='#/login';
			}
			else{
				console.log(response.data.message);
				window.location.href='#/';
			}
		}, function errorCallback(response) {
			console.log(response);
			window.location.href='#/';
		});
	};

}]);

// app.factory('SignupService', ["$http", "$q", "GAuth","$cookies", "$rootScope", function($http, $q, GAuth, $cookies, $rootScope) {
//     var factory = {};
//     factory.localSignup = function(userName, userGmail, userPassword) {
//         //console.log(localUsername);
//         //console.log(localPassword);
//         var deferred = $q.defer();
//         $http({
//             method: 'POST',
//             url: "http://localhost:8080/signup",
//             data: {username: userName, password: userPassword, gmail: userGmail}
//         }).then(function successCallback(response) {
//             //console.log(response);
//             if(response.data.message=="Sign up successfully!") {
//                 deferred.resolve(response);
//             }
//             else{
//                 deferred.reject(response.data.message);
//             }
//         }, function errorCallback(response) {
//             //console.log(response);
//             deferred.reject(response);
//         });
//         return deferred.promise;
//     };

//     return factory;
// }]);


// app.controller('SignupCtrl', ['$scope', '$http', 'SignupService', function($scope, $http, SignupService) {
//         //$rootScope.menu=false;

//         $scope.toLogin = function () {
//         	window.location.href = '#/login';
//         };

