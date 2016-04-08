'use strict';
angular.module('myApp.files', ['ngRoute'])
    .controller('FilesCtrl', [ '$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.menu=true;
    }]);