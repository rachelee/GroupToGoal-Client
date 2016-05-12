'use strict';

var app = angular.module('myApp.main_dashboard', ['ngRoute']);

app.controller('MainCtrl', [ '$scope', "$cookies", '$http', "UserService", "GroupService","$rootScope",function($scope, $cookies, $http, UserService, GroupService,$rootScope) {
        
        $rootScope.menu=true;

        var localGroupname = $cookies.get('currentGroup');
        console.log(localGroupname);


        GroupService.showGroups($cookies.get('currentGroup'))
            .then(
              function(response){
                  $rootScope.groupname = response.data.groupname;
                  $rootScope.groupowner = response.data.groupowner;
                  $rootScope.grouptags = response.data.grouptags;
              }

          )
        // $scope.showGroup = function () {
        //     $http({
        //             method: 'GET',
        //             url: 'http://localhost:8080/showgroup/' + localGroupname
        //             // params: {user: localUsername}
        //         }).then(function successCallback(response) {
        //             console.log(response);

        //             $scope.groupname = response.data.groupname;
        //             $scope.groupowner = response.data.groupowner;
        //             $scope.groupmembers = response.data.groupmembers;
        //             $scope.grouptags = response.data.grouptags;

        //         }, function errorCallback(response) {
        //             console.log(response);
        //             // window.location.href='#/';
        //         });
        //     };

        // $scope.showGroup();     


        var localUsername = UserService.getUsername();
        console.log(localUsername);

        $scope.recommendGroups = function () {
            $http({
                method: 'GET',
                url: 'http://localhost:8080/recommendgroups/' + localUsername
                // params: {user: localUsername}
            }).then(function successCallback(response) {
                console.log(response);

                $scope.groupsRecommend = response.data;
                // if(response.data.message=="Sign up successfully!") {
                //     window.location.href='#/login';
                // }
                // else{
                //  console.log(response.data.message);
                //     window.location.href='#/';
                // }
            }, function errorCallback(response) {
                console.log(response);
                // window.location.href='#/';
            });
        };

        $scope.recommendGroups();  


        $scope.groupsSearch = [];
        var keyword = $scope.keyword

        $scope.searchGroups = function (keyword) {
            $http({
                method: 'GET',
                url: 'http://localhost:8080/searchgroups/' + keyword
                // params: {user: localUsername}
            }).then(function successCallback(response) {
                console.log(response);

                $scope.groupsSearch = response.data;
                // if(response.data.message=="Sign up successfully!") {
                //     window.location.href='#/login';
                // }
                // else{
                //  console.log(response.data.message);
                //     window.location.href='#/';
                // }
            }, function errorCallback(response) {
                console.log(response);
                // window.location.href='#/';
            });
        };

    }]);