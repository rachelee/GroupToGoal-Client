'use strict';
angular.module('myApp.main_dashboard', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/main_dashboard', {
        templateUrl: 'main_dashboard/main_dashboard.html',
        controller: 'MainCtrl'
      });
    }])
    .controller('MainCtrl', [ '$scope', function($scope) {

    }]);