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



app.run(['GAuth', 'GApi', 'GData', '$cookies','UserService','$state', '$rootScope', 'GroupService',
  function(GAuth, GApi, GData, $cookies, UserService, $state, $rootScope, GroupService) {

    //$rootScope.gdata = GData;


     var CLIENT = '339048773288-d1uc4190g7stc84rcm22l4bhg9hch1je.apps.googleusercontent.com';
     GApi.load('blogger', 'v3');
     GAuth.setClient(CLIENT);
     GAuth.setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/blogger');

     function checkAuthFirst(){
        UserService.isLogin().then(
           function(){
                console.log("ALLOW");
               GroupService.getGroupList().then(function(groupListObject){
                       $rootScope.groupMembers = groupListObject.groupMembers;
                       $rootScope.groupWithGmail = [];
                       $rootScope.currentGroup =  groupListObject.currentGroup;
                       $rootScope.groups = groupListObject.groups;
                       //console.log("groups:",$rootScope.groups);
                       //for(var i = $rootScope.groupMembers.length - 1; i >= 0; i--) {
                       //
                       //    GroupService.getGmails($rootScope.groupMembers[i]).then(
                       //        function(response){
                       //            console.log(response.data);
                       //            $rootScope.groupWithGmail.push(response.data);
                       //        }
                       //    );
                       //
                       //}


                   }

               );
                //window.location.href='#/main_dashboard';
           },
           function(){
                var state = $state.current;
                //console.log($state.current);
                if(state.name != 'login'&& state.name != 'signup' && state.name != 'homepage'){
                    console.log('DENY : Redirecting to HomePage');
                    $state.go('homepage');
                }
           }
        );
     }


    $rootScope.$on('$stateChangeStart', function (event, next, current) {
       checkAuthFirst();
    });

    $rootScope.logout = function() {
        console.log("LocalUser: "+$cookies.get('localUserId'));
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            $cookies.remove(k);
        });

        console.log("LocalUser: "+$cookies.get('localUserId'));
        GAuth.logout().then(function () {
          console.log("GAuth logged out")
          $state.go('homepage');
        });
    };


    //$rootScope.username = gdata.getUser().name;
    //$rootScope.group=["Yue Shen", "Dan Su", "Wei Si"];

  }
]);

app.controller('AppCtrl', [ '$scope', "$cookies","GroupService","$state","$rootScope",
    function($scope, $cookies, GroupService, $state, $rootScope) {
        //List groups
        $rootScope.username=$cookies.get('userId');
        $rootScope.localUsername = $cookies.get('localUserId');

        $scope.getMembers=function(currentGroup){
            GroupService.getGroupMembers(currentGroup).then(
                function(groupMemberObject){
                    $rootScope.groupMembers = groupMemberObject.groupMembers;
                    $rootScope.groupWithGmail=[];
                    $rootScope.currentGroup=groupMemberObject.currentGroup;
                    //for(var i = $rootScope.groupMembers.length - 1; i >= 0; i--) {
                    //
                    //    GroupService.getGmails($rootScope.groupMembers[i]).then(
                    //        function(response){
                    //            console.log(response.data);
                    //            $rootScope.groupWithGmail.push(response.data);
                    //        }
                    //    );
                    //
                    //}
                    //console.log(groupMemberObject);
                    //console.log($rootScope.groupMembers);
                    //console.log(groupMemberObject.groupWithGmail);
                },
                function(){
                    console.log("Failed");
                }
            );
        }
    }]);

app.factory('GroupService', ["$http", "$q", "$cookies",  "$state", function($http, $q, $cookies,  $state) {
    var factory = {};
    function getGroup() {
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

    function getMembers(groupname){
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

    factory.getGmails=function(localUsername){
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
    factory.getGroupMembers=function(current_group){
        var deferred = $q.defer();
        var groupMemberObject={};
        getMembers(current_group).then(
            function(response){
                groupMemberObject.currentGroup=current_group;
                var groupMembers = response.data;

                groupMemberObject.groupMembers = groupMembers;
                //console.log(groupMemberObject);
                deferred.resolve(groupMemberObject);

            },
            function(){
                console.log("Failed to get group members");
                deferred.reject();
            }
        );
        return deferred.promise;
    };

    factory.getGroupList=function(){
        var deferred = $q.defer();
        var groupListObject = {};
        getGroup().then(
            function success(grouplist){
                groupListObject.groups=grouplist.data;
                if(groupListObject.groups.length===0){
                    $state.go('group_management');
                }
                else{
                    groupListObject.currentGroup = groupListObject.groups[0];
                    //console.log("current group: ", groupListObject.currentGroup);
                    getMembers(groupListObject.currentGroup).then(
                        function(response){
                            var groupMembers = response.data;
                            groupListObject.groupMembers = groupMembers;
                            deferred.resolve(groupListObject);


                        },
                        function(){
                            console.log("Failed to get group members");
                            deferred.reject();
                        }
                    );
                }

            },
            function error(){
                console.log('Failed to get groups');
                deferred.reject();
            }
        );
        return deferred.promise;
    }
    return factory;
}]);