/**
 * Created by xiaoxiaoli on 2/27/16.
 */
var app = angular.module('myApp.login', ['ngRoute']);

app.factory('UserService', ["$http", "$q", "GAuth","$cookies",function($http, $q, GAuth, $cookies) {
    var factory = {};
    var username = undefined;
    factory.localLogin = function(localUsername, localPassword) {
        //console.log(localUsername);
        //console.log(localPassword);
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: "http://localhost:8080/signin",
            data: {username: localUsername, password:localPassword}
        }).then(function successCallback(response) {
            //console.log(response);
            if(response.data.message=="Sign in successfully!") {
                console.log(response.data.message);
                username=localUsername;
                $cookies.put('localUserId', username);
                deferred.resolve(response);

            }
            else{
                deferred.reject(response.data.message);
            }
        }, function errorCallback(response) {
            //console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    };

    factory.getUsername=function(){
        return $cookies.get('localUserId');
    }
    function isLocalLogin(){
        return $cookies.get('localUserId')!==undefined;
    }
    factory.isLogin = function(){
        var deferred = $q.defer();
        //console.log(isLocalLogin());
        GAuth.checkAuth().then(
            function(){
                //console.log("Google account "+ user + ' is login');
                if(isLocalLogin()){
                    deferred.resolve();
                    //console.log("Local account " + this.username + " is login");
                }
                else{
                    deferred.reject("Local not logged in.");
                }
            },
            function(){
                deferred.reject("Google not logged in.");
            }
        );
        return deferred.promise;
    }

    return factory;

}]);




app.controller('LoginCtrl', ['$scope', 'GAuth', 'GApi', 'GData', '$cookies','UserService','$rootScope', 'GroupService',
    function ($scope, GAuth, GApi, GData, $cookies, UserService, $rootScope, $state, GroupService) {
        //UserService.isLogin().then(function(){
        //    window.location.href = '#/main_dashboard';
        //});

        $scope.toLogin = function () {
            window.location.href = '#/login';
        };

        $scope.toSignup = function () {
            window.location.href = '#/signup';
        };

        //var getGroupInfo = function() {
        //    GroupService.getGroupList().then(function(groupListObject){
        //            $rootScope.groupMembers = groupListObject.groupMembers;
        //            $rootScope.groupWithGmail = [];
        //            $rootScope.currentGroup =  groupListObject.currentGroup;
        //            $rootScope.groups = groupListObject.groups;
        //            //console.log("groups:",$rootScope.groups);
        //            //for(var i = $rootScope.groupMembers.length - 1; i >= 0; i--) {
        //            //
        //            //    GroupService.getGmails($rootScope.groupMembers[i]).then(
        //            //        function(response){
        //            //            console.log(response.data);
        //            //            $rootScope.groupWithGmail.push(response.data);
        //            //        }
        //            //    );
        //            //
        //            //}
        //
        //
        //        }
        //
        //    );
        //};


        var ifLogin = function() {
            $cookies.put('userId', GData.getUser().name);
            window.location.href='#/main_dashboard';
            //getGroupInfo();
        };

        $scope.doLogin = function() {
            UserService.localLogin($scope.localUsername, $scope.localPassword).then(
                function(){
                    GAuth.checkAuth().then(
                        function () {
                            ifLogin();
                        },
                        function() {
                            GAuth.login().then(function(){
                                ifLogin();
                            },
                            function(resp){
                                console.log(resp);
                                $scope.error=res;
                                window.location.href='#/';
                            });
                        }
                    );
                },
                function(res){
                    console.log(res);
                    $scope.error=res;
                    window.location.href='#/';
                }
            );


        };
    }
])