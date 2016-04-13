'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngCookies',
  'angular-google-gapi',
  'myApp.main_dashboard',
  'myApp.study_notes',
  'myApp.chat_room',
  'myApp.files',
  'myApp.version',
  'myApp.login',
  'ui.tinymce',
  'ngSanitize',
  'ui.router',
  'myApp.homepage',
  'myApp.signup',
  'myApp.group_management',
]);

app.config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/main_dashboard');
      $stateProvider
            .state('homepage', {
            url: '/',
            views: {
              'top' : {},
              'side': {},
              'content' : { templateUrl: 'homepage/homepage.html' }
            }
          })
          .state('main_dashboard', {
            url: '/main_dashboard',
            //template:'How to use this?'
            views: {
              'top' : { templateUrl: 'header.html' },
              'side': { templateUrl: 'side.html' },
              'content' : { templateUrl: 'main_dashboard/main_dashboard.html' }
            }
          })
          .state('study_notes', {
            url: '/study_notes',
            views: {
              'top' : { templateUrl: 'header.html' },
              'side': { templateUrl: 'side.html' },
              'content' : { templateUrl: 'study_notes/study_notes.html' }
            }
          })
          .state('files', {
            url: '/files',
            views: {
              'top' : { templateUrl: 'header.html' },
              'side': { templateUrl: 'side.html' },
              'content' : { templateUrl: 'files/files.html' }
            }
          })
          .state('chat_room', {
            url: '/chat_room',
            views: {
              'top' : { templateUrl: 'header.html' },
              'side': { templateUrl: 'side.html' },
              'content' : { templateUrl: 'chat_room/chat_room.html' }
            }
          })
          .state('login', {
            url: '/login',
            views: {
              'top' : {},
              'side': {},
              'content' : { templateUrl: 'login/login.html' }
            }
          })
          .state('signup', {
            url: '/signup',
            views: {
              'top' : {},
              'side': {},
              'content' : { templateUrl: 'signup/signup.html' }
            }
          })
          .state('group_management', {
            url: '/group_management',
            views: {
              'top' : { templateUrl: 'header.html' },
              'side': { templateUrl: 'side.html' },
              'content' : { templateUrl: 'group_management/group_management.html' }
            }
          });

})




// baseApp.run(['GApi', 'GAuth',
//  function(GApi, GAuth) {
//    var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';
//    GApi.load('myApiName','v1',BASE).then(function(resp) {
//      console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
//    }, function(resp) {
//      console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
//    });
//  }
// ]);

app.run(['GAuth', 'GApi', 'GData', '$rootScope', '$cookies','UserService','$state',
  function(GAuth, GApi, GData, $rootScope, $cookies, UserService, $state) {

    $rootScope.gdata = GData;
    $rootScope.username=$cookies.get('userId');
    $rootScope.localUsername = $cookies.get('localUserId');

     var CLIENT = '339048773288-d1uc4190g7stc84rcm22l4bhg9hch1je.apps.googleusercontent.com';
     GApi.load('blogger', 'v3');
     GAuth.setClient(CLIENT);
     GAuth.setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/blogger');

     function checkAuthFirst(){
       UserService.isLogin().then(
           function(){
             console.log("ALLOW");
             //console.log($rootScope.gdata.getUser());
             //window.location.href='#/main_dashboard';
           },
           function(){
             console.log('DENY : Redirecting to Login');
             window.location.href='#/';
           }
       );
     }

     checkAuthFirst();

    //$rootScope.$on('$stateChangeStart', function (event, next,current) {
    //   checkAuthFirst();
    //});

    $rootScope.logout = function() {
      //console.log("LocalUser: "+$cookies.get('localUserId'));
      $state.go('homepage');
      $cookies.remove('localUserId');
      //console.log("LocalUser: "+$cookies.get('localUserId'));
      GAuth.logout().then(function () {
        $cookies.remove('userId');
      });
    };


    //$rootScope.username = gdata.getUser().name;
    //$rootScope.group=["Yue Shen", "Dan Su", "Wei Si"];

  }
]);

app.controller('AppCtrl', [ '$scope', "$cookies", "UserService", "$rootScope", "$http", "GroupService",
    function($scope, $cookies, UserService, $rootScope, $http, GroupService) {

        //List groups
        function getGroup(){
            GroupService.getGroup().then(
                function success(user_list){
                    $scope.groups=user_list.data;
                    $cookies.put("groups", $scope.groups);
                },
                function error(){
                    console.log('Failed to get groups');
                }
            );
        }
        getGroup();
        $scope.switchGroup = function(){
            getGroup();
        };

        $scope.getGroupMembers=function(groupname){
            var groupWithGmail={};
            GroupService.getMembers(groupname).then(
                function(response){
                    var groupMembers = response.data;
                    for(var i = groupMembers.length - 1; i >= 0; i--) {
                        if(groupMembers[i] == $rootScope.localUsername) {
                            continue;
                        }
                        else{
                            GroupService.getGmails(groupMembers[i]).then(
                                function(response){
                                    //console.log(response);
                                    groupWithGmail[groupMembers[i]]=response.data;
                                }
                            );
                        }
                    }
                    $cookies.put('group', groupMembers);
                    $cookies.put('groupWithGmail', groupWithGmail);
                    console.log($cookies.get('group'));
                    console.log($cookies.get('groupWithGmail'));

                },
                function(){
                    console.log("Failed to get group members");
                }
            );
        }


    }]);

app.factory('GroupService', ["$http", "$q", "GAuth","$cookies", function($http, $q, GAuth, $cookies) {
    var factory = {};
    factory.getGroup = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: "http://localhost:8080/listGroups/"+$cookies.get("localUserId")
        }).then(function successCallback(response) {
            //console.log(response);
            deferred.resolve(response);
        }, function errorCallback(response) {
            //console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    };

    factory.getMembers = function(groupname){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: "http://localhost:8080/listUsers/"+groupname
        }).then(function successCallback(response) {
            //console.log(response);
            deferred.resolve(response);
        }, function errorCallback(response) {
            //console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    }

    factory.getGmails = function(localUsername){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: "http://localhost:8080/getGmail/"+localUsername
        }).then(function successCallback(response) {
            //console.log(response);
            deferred.resolve(response);
        }, function errorCallback(response) {
            //console.log(response);
            deferred.reject(response);
        });
        return deferred.promise;
    }
    return factory;
}]);