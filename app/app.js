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
]);
app.config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/main_dashboard');
      $stateProvider
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
            url: '/',
            views: {
              'top' : {},
              'side': {},
              'content' : { templateUrl: 'login/login.html' }
            }
          });

})




//baseApp.run(['GApi', 'GAuth',
//  function(GApi, GAuth) {
//    var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';
//    GApi.load('myApiName','v1',BASE).then(function(resp) {
//      console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
//    }, function(resp) {
//      console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
//    });
//  }
//]);

app.run(['GAuth', 'GApi', 'GData', '$rootScope','$window','$cookies','UserService','$state',
  function(GAuth, GApi, GData, $rootScope, window, $cookies, UserService, $state) {

    $rootScope.gdata = GData;

    var CLIENT = '339048773288-d1uc4190g7stc84rcm22l4bhg9hch1je.apps.googleusercontent.com';
    //var BASE = '//localhost:8000/app/';

    //GApi.load('myContactApi', 'v1', BASE);
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
    $rootScope.$on('$stateChangeStart', function (event, next,current) {
      checkAuthFirst();
    });

    $rootScope.logout = function() {
      //console.log("LocalUser: "+$cookies.get('localUserId'));
      $state.go('login');
      $cookies.remove('localUserId');
      //console.log("LocalUser: "+$cookies.get('localUserId'));
      //GAuth.logout().then(function () {
      //  $cookies.remove('userId');
      //});
    };


    //$rootScope.username = gdata.getUser().name;
    $rootScope.group=["Yue Shen", "Dan Su", "Wei Si"];

  }
]);

