'use strict';

var app = angular.module('myApp.user_profile', ['ngRoute']);

app.controller('ProfileCtrl', [ '$scope', '$rootScope', '$http', 'UserService', function($scope, $rootScope, $http, UserService) {
        // $rootScope.menu=true;

        var localUsername = UserService.getUsername();
        console.log(localUsername);
        
        $scope.getProfile = function () {
	        $http({
	        		method: 'GET',
	        		url: 'http://localhost:8080/getProfile/' + localUsername
	        		// params: {user: localUsername}
	        	}).then(function successCallback(response) {
		            console.log(response);

		            $scope.username = response.data.username;
		            $scope.gmail = response.data.gmail;
		            $scope.interests = response.data.interests;

		        }, function errorCallback(response) {
		            console.log(response);
	                // window.location.href='#/';
		        });
	        };

	    $scope.getProfile();


	    $scope.password = "";
	    $scope.passwordcopy = "";

	    $scope.updateProfile = function () {
	    	console.log($scope.interests);
	        $http({
	        		method: 'POST',
	        		url: 'http://localhost:8080/updateprofile/' + localUsername,
	        		data: {password: $scope.password, interests: $scope.interests}
	        	}).then(function successCallback(response) {
		            console.log(response.data);
		        }, function errorCallback(response) {
		            console.log(response.data);
	                // window.location.href='#/';
		        });
	        };
    }]);