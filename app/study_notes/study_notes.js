'use strict';

var app = angular.module('myApp.study_notes', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/study_notes', {
    templateUrl: 'study_notes/study_notes.html',
    controller: 'StudyNotesCtrl'
  });
}])

app.controller('StudyNotesCtrl', ['$scope', '$sce', '$http',function($scope, $sce, $http) {

    $scope.posts=[];
    var post = {};
    post.author={};
    $scope.visible = false;
    $scope.publish = function(){
        if($scope.visible==false)
            $scope.visible = !$scope.visible
        else{
            post.published=new Date();
            post.author.displayname="Xiaoxiao Li";//To Do: later add username here
            console.log(post);
            post = publishNewPost($scope.post);
            console.log(post);
            $scope.posts.push(post);
            $scope.visible = !$scope.visible
        }
    };


    //$scope.updateHtml = function() {
    //    $scope.contentHtml = $sce.trustAsHtml($scope.content);
    //};

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
    //$http({
    //    method:'GET',
    //    url:'http://localhost:8080/test'
    //}).success(
    //    function(data){
    //        console.log(data);
    //        $scope.article=data;
    //    }
    //)
    //    .error(function(data, status) {
    //        console.error('Error', status, data);
    //    });


}]);
app.directive('ngPost',function(){
      return {
        restrict: 'E',
        templateUrl: 'post.html'
      }
});



