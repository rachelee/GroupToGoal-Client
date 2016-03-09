"use strict"

var app = angular.module('myApp.study_notes', ['ngRoute']);
var blogURL = 'http://groutogoalnotes.blogspot.com/';
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/study_notes', {
    templateUrl: 'study_notes/study_notes.html',
    controller: 'StudyNotesCtrl'
  });
}])

app.controller('StudyNotesCtrl', ['$scope','GApi', '$rootScope', function($scope, GApi, $rootScope) {
    $rootScope.blog_ids={'self':"6398562378207461363",
        'others':[{'name':'Yue Shen', 'blog_id':"3213900"}, {'name':'Dan Su', 'blog_id':"5580000621368117250"}]};
    $scope.blog = {};
    $scope.blog.posts=[];
    $scope.newPost = {};
    $scope.newPost.author={};
    $scope.visible = false;
    $scope.publish = function(){
        $scope.error = "";
        if($scope.visible==false)
            $scope.visible = !$scope.visible
        else{
            $scope.newPost.published=new Date();
            $scope.newPost.author.displayname=$rootScope.gdata.getUser().name;//To Do: later add username here
            //console.log(post);
            console.log($scope.newPost.title);
            console.log($scope.newPost.content);
            //Post a new post
            if($scope.newPost.title==undefined) {
                $scope.error = "Please enter title for your post!"
            }
            else if ($scope.newPost.content==undefined) {
                $scope.error = "Please enter content for your post!"
            }
            else {
                GApi.executeAuth('blogger', 'posts.insert', {
                    'blogId': $scope.blog.id,
                    'resource': $scope.newPost
                }).then(function (resp) {
                    $scope.newPost = resp;
                    $scope.blog.posts.unshift($scope.newPost);
                    $scope.visible = !$scope.visible
                    console.log($scope.newPost);
                }, function () {
                    console.log("error post new post");
                });
            }


        }
    };

    //WISWIG editor plugin
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


    //Get blog id
    //$scope.getPosts = function(){
    //    //Get blog id from URL
    //    GApi.executeAuth('blogger', 'blogs.getByUrl', {'url': blogURL}).then( function(resp) {
    //        $scope.value = resp;
    //        $scope.blog.id = $scope.value.id;
    //        console.log($scope.blog.id);
    //        $scope.blog.name = $scope.value.result.name;
    //
    //    }, function() {
    //        console.log("error :(");
    //    });
    //};


    //Get self posts
    $scope.tab = 1;
    GApi.executeAuth('blogger', 'posts.list', {'blogId': $rootScope.blog_ids.self}).then( function(resp) {
        $scope.value = resp;
        $scope.blog.posts = $scope.value.items;
        console.log($scope.value)
    }, function() {
        console.log("error get post list failed");
    });


    $scope.getPosts = function(id){
        if(id===$rootScope.blog_ids.self){
            $scope.tab=1;
        }
        else{
            $scope.tab=2;
        }

        GApi.executeAuth('blogger', 'posts.list', {'blogId':id}).then( function(resp) {
            $scope.value = resp;
            $scope.blog.posts = $scope.value.items;
            console.log($scope.value)
        }, function() {
            console.log("error get post list failed");
        });


    }




}]);
