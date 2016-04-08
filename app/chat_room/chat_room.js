'use strict';
angular.module('myApp.chat_room', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/chat_room', {
        templateUrl: 'chat_room/chat_room.html',
        controller: 'ChatRoomCtrl'
      });
    }])
    .controller('ChatRoomCtrl', [ '$scope','$rootScope', function($scope, $rootScope) {
        $rootScope.menu=true;
    }]);