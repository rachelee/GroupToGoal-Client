'use strict';

var app = angular.module('myApp.study_notes', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/study_notes', {
    templateUrl: 'study_notes/study_notes.html',
    controller: 'StudyNotesCtrl'
  });
}])

app.controller('StudyNotesCtrl', ['$scope', '$sce', '$http',function($scope, $sce, $http) {


  $scope.visible = false;
  $scope.publish = function(){
    $scope.visible = !$scope.visible
  };

  $scope.tinymce = "";
  $scope.updateHtml = function() {
    $scope.tinymceHtml = $sce.trustAsHtml($scope.tinymce);
  };

  $scope.tinymceOptions = {
    selector: 'textarea',
    trusted:true,
    plugins: [ 'autoresize advlist autolink lists link charmap print preview ',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime table contextmenu paste',
      'image imagetools codesample',
      'textcolor colorpicker' ],
    toolbar: 'insertfile undo redo | styleselect ' + '| forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify ' + '| bullist numlist outdent indent | link image codesample'

  };
    $http({
        method:'GET',
        url:'http://localhost:8080/test'
    }).success(
        function(data){
            console.log(data);
            $scope.article=data;
        }
    )
        .error(function(data, status) {
            console.error('Error', status, data);
        });


}])
    .directive('ngPost',function(){
      return {
        restrict: 'E',
        templateUrl: 'post.html'
      }
    });



