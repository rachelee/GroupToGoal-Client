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
  'myApp.user_profile'
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
            },
              resolve:{
                  authenticate: function(UserService, $state, $q){
                      var deferred = $q.defer();
                      UserService.isLogin().then(
                          function(){
                              console.log("ALLOW");
                              deferred.resolve();
                          },
                          function(){
                              $state.go('homepage');
                          }
                      );
                      return deferred.promise;
                  },
              }
          })
          .state('study_notes', {
            url: '/study_notes',
            views: {
              'top' : { templateUrl: 'header.html' },
              'side': { templateUrl: 'side.html' },
              'content' : { templateUrl: 'study_notes/study_notes.html' }
            },
              resolve:{
                  authenticate: function(UserService, $state, $q){
                      var deferred = $q.defer();
                      UserService.isLogin().then(
                          function(){
                              console.log("ALLOW");
                              deferred.resolve();
                          },
                          function(){
                              $state.go('homepage');
                          }
                      );
                      return deferred.promise;
                  }
              }
          })
          .state('files', {
            url: '/files',
            views: {
              'top' : { templateUrl: 'header.html' },
              'side': { templateUrl: 'side.html' },
              'content' : { templateUrl: 'files/files.html' }
            },
              resolve:{
                  authenticate: function(UserService, $state, $q){
                      var deferred = $q.defer();
                      UserService.isLogin().then(
                          function(){
                              console.log("ALLOW");
                              deferred.resolve();
                          },
                          function(){
                              $state.go('homepage');
                          }
                      );
                      return deferred.promise;
                  }
              }
          })
          .state('chat_room', {
            url: '/chat_room',
            views: {
              'top' : { templateUrl: 'header.html' },
              'side': { templateUrl: 'side.html' },
              'content' : { templateUrl: 'chat_room/chat_room.html' }
            },
              resolve:{
                  authenticate: function(UserService, $state, $q){
                      var deferred = $q.defer();
                      UserService.isLogin().then(
                          function(){
                              console.log("ALLOW");
                              deferred.resolve();
                          },
                          function(){
                              $state.go('homepage');
                          }
                      );
                      return deferred.promise;
                  }
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
            },
              resolve:{
                  authenticate: function(UserService, $state, $q){
                      var deferred = $q.defer();
                      UserService.isLogin().then(
                          function(){
                              console.log("ALLOW");
                              deferred.resolve();
                          },
                          function(){
                              $state.go('homepage');
                          }
                      );
                      return deferred.promise;
                  }
              }
          })
          .state('user_profile', {
            url: '/user_profile',
            views: {
              'top' : { templateUrl: 'header.html' },
              'side': { templateUrl: 'side.html' },
              'content' : { templateUrl: 'user_profile/user_profile.html' }
            },
              resolve:{
                  authenticate: function(UserService, $state, $q){
                      var deferred = $q.defer();
                      UserService.isLogin().then(
                          function(){
                              console.log("ALLOW");
                              deferred.resolve();
                          },
                          function(){
                              $state.go('homepage');
                          }
                      );
                      return deferred.promise;
                  }
              }
          });

})



app.run(['GAuth', 'GApi', 'GData', '$cookies','UserService','$state', '$rootScope', 'GroupService', '$q', 
  function(GAuth, GApi, GData, $cookies, UserService, $state, $rootScope, GroupService, $q) {

    //$rootScope.gdata = GData;


     var CLIENT = '339048773288-d1uc4190g7stc84rcm22l4bhg9hch1je.apps.googleusercontent.com';
     GApi.load('blogger', 'v3');
     GAuth.setClient(CLIENT);
     GAuth.setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/blogger');

    $rootScope.logout = function() {
        //console.log("LocalUser: "+$cookies.get('localUserId'));
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            $cookies.remove(k);
        });

        //console.log("LocalUser: "+$cookies.get('localUserId'));
        GAuth.logout().then(function () {
          console.log("GAuth logged out")
          $state.go('homepage');
        });
    };

    


  }
]);

app.controller('AppCtrl', [ '$scope', "$cookies","GroupService","$state","$rootScope", "$q",
    function($scope, $cookies, GroupService, $state, $rootScope, $q) {
        //List groups
        $rootScope.username=$cookies.get('userId');
        $rootScope.localUsername = $cookies.get('localUserId');
        $rootScope.localPassword= $cookies.get('localPassword');

        $rootScope.groupMemberGmails=[];
        function getGroupInfo(){
            GroupService.getGroup()
                .then(
                function(response){
                    $rootScope.groups=response;
                    if($cookies.get('currentGroup')===undefined) {
                        $cookies.put('currentGroup', response[0]);
                        return GroupService.getMembers(response[0], $cookies.get('localUserId'));
                    }
                    else{
                        return GroupService.getMembers($cookies.get('currentGroup'), $cookies.get('localUserId'));
                    }
                })
                .then(
                function(groupMembers){
                    $rootScope.groupMembers=groupMembers;
                    return getGmailList(groupMembers);
                }
            )
                .then(
                function(results){
                    $rootScope.groupMemberGmails=[]
                    for(var i=0;i<results.length;i++){
                        $rootScope.groupMemberGmails.push(results[i].data);
                    }
                    // console.log($rootScope.groups);
                    // console.log($rootScope.groupMembers);
                    // console.log($rootScope.groupMemberGmails);
                    // console.log($cookies.get('currentGroup'));
                }
            );

                
            GroupService.getGroup()
                .then(
                function(response){
                    $rootScope.groups=response;
                    if($cookies.get('currentGroup')===undefined) {
                        $cookies.put('currentGroup', response[0]);
                        return GroupService.showGroups(response[0]);
                    }
                    else{
                        return GroupService.showGroups($cookies.get('currentGroup'));
                    }
                })
                .then(
                function(response){
                  $rootScope.groupname = response.data.groupname;
                  $rootScope.groupowner = response.data.groupowner;
                  $rootScope.grouptags = response.data.grouptags;
                  //console.log("Testing: "+$rootScope.groupname);
                })
        }

        

        function getGmailList(groupMembers){
            var promiseList = [];
            for(var i=0;i<groupMembers.length;i++){
                promiseList.push(GroupService.getGmails(groupMembers[i]));
            }
            return $q.all(promiseList);
        }

        getGroupInfo();
        $scope.switchGroup=function(name){
            $cookies.put('currentGroup', name);
            GroupService.getMembers($cookies.get('currentGroup'), $cookies.get('localUserId'))
                .then(function(groupMembers){
                    $rootScope.groupMembers=groupMembers;
                    return getGmailList(groupMembers);
                })
                .then(function(results){
                    $rootScope.groupMemberGmails=[];
                    for(var i=0;i<results.length;i++){
                        $rootScope.groupMemberGmails.push(results[i].data);
                    }
                    console.log($rootScope.groups);
                    console.log($rootScope.groupMembers);
                    console.log($rootScope.groupMemberGmails);
                    console.log($cookies.get('currentGroup'));
                });
            GroupService.showGroups(name)
                .then(
                  function(response){
                      $rootScope.groupname = response.data.groupname;
                      $rootScope.groupowner = response.data.groupowner;
                      $rootScope.grouptags = response.data.grouptags;
                  }

              )
        };


    }]);

app.factory('GroupService', ["$http", "$q", "$cookies",  "$state", function($http, $q, $cookies,  $state) {
    var factory = {};
    factory.getGroup=function() {
        var deferred = $q.defer();
        if($cookies.get('localUserId')==null){
            deferred.reject("User is not logged in");
        }
        else{
            $http({
                method: 'GET',
                url: "http://localhost:8080/listGroups/"+$cookies.get("localUserId")
            }).then(function successCallback(response) {
                if(response.data.length===0){
                    $state.go('group_management');
                    deferred.reject('User is not in any group');
                }
                else{
                    //$cookies.put('groups', response.data);
                    deferred.resolve(response.data);
                }
            }, function errorCallback(response) {;
                deferred.reject(response);
            });
        }

        return deferred.promise;
    };

    factory.getMembers=function(groupname, localUsername){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: "http://localhost:8080/listUsers/"+groupname
        }).then(function successCallback(response) {
            var groupMembers = [];
            for(var i=0;i<response.data.length;i++){
                //console.log(localUsername);
                if(response.data[i]!==localUsername){
                    groupMembers.push(response.data[i]);
                }
            }
            deferred.resolve(groupMembers);
        }, function errorCallback(response) {
            //console.log(response);
            deferred.reject("Failed to get group members");
        });
        return deferred.promise;
    }

    factory.getGmails=function(localUsername){
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: "http://localhost:8080/getGmail/"+localUsername
        }).then(function successCallback(response) {
            deferred.resolve(response);
        }, function errorCallback() {
            deferred.reject('Failed to get groups');
        });
        return deferred.promise;
    }

    factory.showGroups=function(groupname){
      var deferred = $q.defer();
      $http({
          method: 'GET',
          url: 'http://localhost:8080/showgroup/' + groupname
          // params: {user: localUsername}
      }).then(function successCallback(response) {
          //console.log(response);
          deferred.resolve(response);
          // $scope.groupname = response.data.groupname;
          // $scope.groupowner = response.data.groupowner;
          // $scope.groupmembers = response.data.groupmembers;
          // $scope.grouptags = response.data.grouptags;

      }, function errorCallback(response) {
          console.log(response);
          deferred.reject('Failed to get group information');
          // window.location.href='#/';
      });
      return deferred.promise;
  }

    return factory;
}]);