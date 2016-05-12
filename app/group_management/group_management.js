'use strict';
var app = angular.module('myApp.group_management', ['ngRoute'])
    
app.controller('GroupCtrl', ['$scope', '$rootScope','$http', 'UserService', 
	function($scope, $rootScope, $http, UserService) {
        //$rootScope.menu=false;
        var localUsername = UserService.getUsername();
        console.log(localUsername);


        
        $scope.ownGroups = function () {
        	$http({
        		method: 'GET',
        		url: 'http://localhost:8080/owngroups/' + localUsername
        		// params: {user: localUsername}
        	}).then(function successCallback(response) {
	            console.log(response);

	            $scope.groupsOwn = response.data;

	        }, function errorCallback(response) {
	            console.log(response);
                // window.location.href='#/';
	        });
        };

        $scope.ownGroups();



        $scope.inGroups = function () {
        	$http({
        		method: 'GET',
        		url: 'http://localhost:8080/joinedgroups/' + localUsername
        		// params: {user: localUsername}
        	}).then(function successCallback(response) {
	            console.log(response);
	            $scope.groupsJoin = response.data;


	        }, function errorCallback(response) {
	            console.log(response);
                // window.location.href='#/';
	        });
        };

        $scope.inGroups();



        $scope.recommendGroups = function () {
        	$http({
        		method: 'GET',
        		url: 'http://localhost:8080/recommendgroups/' + localUsername
        		// params: {user: localUsername}
        	}).then(function successCallback(response) {
	            console.log(response);

	            $scope.groupsRecommend = response.data;

	        }, function errorCallback(response) {
	            console.log(response);
                // window.location.href='#/';
	        });
        };

        $scope.recommendGroups();



        $scope.createGroup = function () { 

        	$scope.groupsOwn.push($scope.newgroupname);

			$http({
	            method: 'POST',
	            url: "http://localhost:8080/creategroup/" + localUsername,
	            data: {groupname: $scope.newgroupname, groupowner: localUsername, groupmembers: localUsername, grouptags: $scope.newgrouptags}
	        }).then(function successCallback(response) {
	            console.log(response.data);

	            $scope.newgroupname = "";
	            $scope.newgrouptags = "";


	        }, function errorCallback(response) {
	            console.log(response.data);
                // window.location.href='#/';
	        });
	    };

	   	$scope.deleteGroup = function (newgroupname) { 
			$http({
	            method: 'DELETE',
	            url: "http://localhost:8080/deletegroup/" + newgroupname
	        }).then(function successCallback(response) {
	            console.log(response.data);
	            var index = $scope.groupsOwn.indexOf(newgroupname);
	            if(index>-1){
	            	$scope.groupsOwn.splice(index, 1);
	            }

	        }, function errorCallback(response) {
	            console.log(response.data);
	        });
	    };

	   	$scope.withdrawGroup = function (newgroupname) {
	  		$http({
	            method: 'POST',
	            url: "http://localhost:8080/withdrawgroup/" + newgroupname + '/' + localUsername 
	        }).then(function successCallback(response) {
	            console.log(response.data);
	            var index = $scope.groupsJoin.indexOf(newgroupname);
	            if(index>-1){
	            	$scope.groupsJoin.splice(index, 1);
	            }

	        }, function errorCallback(response) {
	            console.log(response.data);
	        });
	    };

	   	$scope.joinGroup = function (newgroupname) {

	   		$scope.groupsJoin.push(newgroupname);

	  		$http({
	            method: 'POST',
	            url: "http://localhost:8080/joingroup/" + localUsername,
	            data: {groupname: newgroupname}
	        }).then(function successCallback(response) {
	            console.log(response.data);
	        }, function errorCallback(response) {
	            console.log(response.data);
	        });
	    };	    

    }]);