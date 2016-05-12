var app = angular.module('myApp.homepage', ['ngRoute']);


app.controller('HomepageCtrl', [ '$scope', '$rootScope', function($scope) {

        $scope.toLogin = function () {
        	window.location.href = '#/login';
        }

        $scope.toSignup = function () {
        	window.location.href = '#/signup';
        }
    }]);
