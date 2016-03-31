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

app.controller('loginCtrl', ['$scope', 'GAuth', 'GData', '$window', '$cookies',
    function clientList($scope, GAuth, GData, window, $cookies) {
        if(GData.isLogin()){
            window.location.href='#/study_notes';
        }

        var ifLogin = function() {
            $cookies.put('userId', GData.getUserId());
            window.location.href='#/study_notes';
        };

        $scope.doLogin = function() {
            GAuth.checkAuth().then(
                function () {
                    ifLogin();
                },
                function() {
                    GAuth.login().then(function(){
                        ifLogin();
                    });
                }
            );

        };
    }
])