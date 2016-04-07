/**
 * Created by xiaoxiaoli on 2/27/16.
 */
var app = angular.module('myApp.login', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'loginCtrl'
    });
}])

app.factory('LocalLoginService', ["$http", "$q", "GData","$rootScope", function($http, $q, GData, $rootScope) {
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
                username=localUsername;
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
        return username;
    }
    factory.isLocalLogin=function(){
        return username===undefined;
    }
    factory.isLogin = function(){
        var deferred = $q.defer();
        if(GData.isLogin()&&this.isLocalLogin()){
            $rootScope.isLogin=true;
            deferred.resolve();
        }
        else{
            deferred.reject();
        }
        return deferred.promise;
    }
    return factory;
}]);

app.controller('loginCtrl', ['$scope', 'GAuth', 'GData', '$window', '$cookies','LocalLoginService','$rootScope',
    function ($scope, GAuth, GData, window, $cookies, LocalLoginService, $rootScope) {
        LocalLoginService.isLogin().then(
            function(){
                console.log("here");
                window.location.href='#/';
            },
            function(){
                console.log("Not logged in");
            }
        );


        var ifLogin = function() {
            $cookies.put('userId', GData.getUserId());
            $cookies.put('localUserId', LocalLoginService.getUsername());
            $rootScope.isLogin=true;
            window.location.href='#/';
        };

        $scope.doLogin = function() {
            LocalLoginService.localLogin($scope.localUsername, $scope.localPassword).then(
                function(){
                    GAuth.checkAuth().then(
                        function () {
                            console.log("1");
                            ifLogin();
                        },
                        function() {
                            console.log("2");
                            GAuth.login().then(function(){
                                ifLogin();
                            },
                            function(resp){
                                console.log(resp);
                                $scope.error=res;
                                window.location.href='#/login';
                            });
                        }
                    );
                },
                function(res){
                    console.log(res);
                    $scope.error=res;
                    window.location.href='#/login';
                }
            );


        };
    }
])