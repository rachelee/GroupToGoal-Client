'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngRoute',
  'ngCookies',
  'angular-google-gapi',
  'myApp.main_dashboard',
  'myApp.QandA',
  'myApp.study_notes',
  'myApp.chat_room',
  'myApp.files',
  'myApp.version',
  'myApp.login',
  'ui.tinymce',
  'ngSanitize',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .otherwise({ redirectTo: '/main_dashboard' });

}])




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

.run(['GAuth', 'GApi', 'GData', '$rootScope','$window','$cookies','UserService',
  function(GAuth, GApi, GData, $rootScope, window, $cookies, UserService) {

    $rootScope.gdata = GData;

    var CLIENT = '339048773288-d1uc4190g7stc84rcm22l4bhg9hch1je.apps.googleusercontent.com';
    //var BASE = '//localhost:8000/app/';

    //GApi.load('myContactApi', 'v1', BASE);
    GApi.load('blogger', 'v3');
    GAuth.setClient(CLIENT);
    GAuth.setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/blogger');

    //GAuth.checkAuth().then(
    //    function (user) {
    //      console.log(user.name + ' is login')
    //      //window.location.href='#/main_dashboard'; // an example of action if it's possible to
    //      // authenticate user at startup of the application
    //    },
    //    function() {
    //      window.location.href='#/login';       // an example of action if it's impossible to
    //      // authenticate user at startup of the application
    //    }
    //);
    $rootScope.$on('$routeChangeStart', function (event, next,current) {
      UserService.isLogin().then(
          function(){
            console.log("ALLOW");
            window.location.href='#/main_dashboard';
          },
          function(){
            console.log('DENY : Redirecting to Login');
            window.location.href='#/login';
          }
      );
    });

    $rootScope.logout = function() {
      //console.log("LocalUser: "+$cookies.get('localUserId'));
      $cookies.remove('localUserId');
      //console.log("LocalUser: "+$cookies.get('localUserId'));
      GAuth.logout().then(function () {
        $cookies.remove('userId');

      });
    };


    //$rootScope.username = gdata.getUser().name;
    $rootScope.group=["Yue Shen", "Dan Su", "Wei Si"];
  }
]);

//baseApp.run(['GAuth', 'GApi', 'GData', '$state', '$rootScope',
//  function(GAuth, GApi, Gdata, $state, $rootScope) {
//
//    $rootScope.gdata = GData;
//
//    var CLIENT = '339048773288-fgu6hiji5nkolmugeedhs7s176ptsjh5.apps.googleusercontent.com';
//    var BASE = '//localhost:8000/app';
//
//    GApi.load('myContactApi', 'v1', BASE);
//    GApi.load('blogger', 'v3'); // for google api (https://developers.google.com/apis-explorer/)
//
//    GAuth.setClient(CLIENT);
//    GAuth.setScope("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/blogger"); // default scope is only https://www.googleapis.com/auth/userinfo.email
//
//    GAuth.checkAuth().then(
//        function (user) {
//          console.log(user.name + 'is login')
//          $state.go('myApp.study_notes'); // an example of action if it's possible to
//          // authenticate user at startup of the application
//        },
//        function() {
//          $state.go('myApp.dashboard');       // an example of action if it's impossible to
//          // authenticate user at startup of the application
//        }
//    );
//
//  }
//]);