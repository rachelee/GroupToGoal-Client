/**
 * Created by xiaoxiaoli on 2/27/16.
 */
var app = angular.module('myApp.login', ['ngRoute']);

app.factory('UserService', ["$http", "$q", "GAuth","$cookies", "$rootScope",function($http, $q, GAuth, $cookies, $rootScope) {
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
            function(user){
                //console.log("Google account "+ user.name + ' is login');
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

app.controller('loginCtrl', ['$scope', 'GAuth', 'GData', '$window', '$cookies','UserService','$rootScope',
    function ($scope, GAuth, GData, window, $cookies, UserService, $rootScope) {
        $rootScope.menu=false;
        //console.log("Login controller");
        //UserService.isLogin().then(
        //    function(){
        //        //console.log("here");
        //        window.location.href='#/main_dashboard';
        //    },
        //    function(){
        //        //console.log("Not logged in");
        //    }
        //);


        var ifLogin = function() {
            $cookies.put('userId', GData.getUserId());
            window.location.href='#/main_dashboard';
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