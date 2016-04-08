'use strict';
angular.module('myApp.main_dashboard', ['ngRoute'])
    .controller('MainCtrl', [ '$scope', "$cookies", "UserService", "$rootScope",function($scope, $cookies, UserService, $rootScope) {
        $rootScope.menu=true;
        //console.log($cookies.get('localUserId'));
        //UserService.isLogin().then(
        //    function(){
        //        console.log("Login successful");
        //    },
        //    function(){
        //        $rootScope.isLogin=false;
        //        window.location.href='#/login';
        //    }
        //);
    }]);