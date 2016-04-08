'use strict';
angular.module('myApp.files', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/files', {
            templateUrl: 'files/files.html',
            controller: 'FilesCtrl'
        });
    }])
    .controller('FilesCtrl', [ '$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.menu=true;
    }]);