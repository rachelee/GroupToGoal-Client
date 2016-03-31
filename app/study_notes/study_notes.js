"use strict"

var app = angular.module('myApp.study_notes', ['ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/study_notes', {
    templateUrl: 'study_notes/study_notes.html',
    controller: 'StudyNotesCtrl'
  });
}]);


app.factory('BlogIdService', ["$q","$http", "GApi", function($q, $http, GApi) {
    var factory = {};
    var blog_ids = [];
    var getIdWithUrl = function(username, Url){
        var deferred = $q.defer();
        GApi.executeAuth('blogger', 'blogs.getByUrl', {'url': Url}).then( function(resp) {
            var blogId = resp.id;
            blog_ids[username] = blogId;
            deferred.resolve(blogId);
        }, function(msg) {
            //console.log(msg);
            deferred.reject("Failed to find blog id from google. Please make sure you entered the correct url!")
        });
        return deferred.promise;
    }
    factory.getId = function(username) {
        var deferred = $q.defer();
        if( blog_ids[username] !== undefined){
            deferred.resolve(blog_ids[username]);
        }
        else{
            $http({
                method: 'GET',
                url: 'http://localhost:3000/blog_id',
                params: {user: username}
            }).then(function successCallback(response) {
                if(response.data.length==0)
                    deferred.reject("No id found!");
                else{
                    blog_ids[username]=response.data[0].blog_id;
                    deferred.resolve(blog_ids[username]);
                    //console.log(blog_ids[username]);
                }
            }, function errorCallback(response) {
                deferred.reject(response);
            });
        }
        return deferred.promise;

    }
    factory.setId = function(username, url){
        var deferred = $q.defer();
        getIdWithUrl(username, url).then(
            function(blogId){
                $http({
                    method: 'POST',
                    url: 'http://localhost:3000/blog_id',
                    data: {user: username, id:blogId}
                }).then(function (msg) {
                    deferred.resolve(msg);
                }, function (response) {
                    deferred.reject("Failed to save blog id, please try again!");
                });
            },
            function(msg){
                deferred.reject(msg);
            }
        );
        return deferred.promise;

    }

    return factory;
}]);


app.factory('BlogPostsService', ["GApi", "$http", "$q", "BlogIdService", function(GApi, $http, $q, BlogIdService) {
    var factory = {};
    factory.getPost = function(username) {
        var deferred = $q.defer();
        BlogIdService.getId(username).then(
            function(blogId){
                GApi.executeAuth('blogger', 'posts.list', {'blogId': blogId}).then(function (resp) {
                    if(resp.items==undefined){
                        deferred.reject("No post found!");
                    }
                    deferred.resolve(resp.items);
                }, function (msg) {
                    deferred.reject(msg);
                });
            },
            function(msg){
                //console.log(msg);
                deferred.reject(msg);
            }
        );
        return deferred.promise;
    }

    return factory;
}]);


app.controller('StudyNotesCtrl', ['$scope','GApi', '$http', '$rootScope','$q', 'BlogPostsService','BlogIdService',
    function($scope, GApi, $http, $rootScope, $q, BlogPostsService, BlogIdService) {
    //$rootScope.blog_ids = {
    //    'self': "6398562378207461363",
    //    'others': [{'name': 'Yue Shen', 'blog_id': "3213900"}, {'name': 'Dan Su', 'blog_id': "5580000621368117250"}]
    //};

    //Get self posts
    $scope.tab = 1;


    $scope.blog = {};
    $scope.blog.posts=[]; //current displayed post list, can be from a user's blog or search result
    $scope.search_result = {}; //result of last search
    $scope.search_result.posts = [];
    $scope.newPost = {};
    $scope.newPost.author={};
    $scope.visible = false;
    $scope.setId = false;
    //initial posts
    function initPost(){
        $scope.blog.posts=BlogPostsService.getPost($rootScope.username).then(function (posts) {
            console.log(posts);
            $scope.blog.posts = posts;
        }, function (message) {
            if(message==="No id found!"){
                $scope.setId=true;
            }
        });
    }
    initPost();

    $scope.getPosts = function(username){
        if(username === $rootScope.username){
            $scope.tab=1;
        }
        else{
            $scope.tab=2;
        }
        BlogPostsService.getPost(username).then(function(posts) {
                $scope.post_error = undefined;
                $scope.blog.posts = posts;
            },
            function (message){
                $scope.blog.posts=[];
                console.log(message);
                $scope.post_error = "No post in "+username+"'s study notes."
            }
        );
    }


        //console.log(BlogPostsService.getPost("Xiaoxiao Li"));
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


    $scope.searchTab = function(){
        $scope.post_error = undefined;
        $scope.tab=3;
        $scope.blog.posts = $scope.search_result.posts;
    }

    function executeSearch(){
        $scope.search_result.posts = [];
        var blog_id_list = [];
        blog_id_list.push($rootScope.blog_ids.self);
        for(var i in $rootScope.blog_ids.others){
            blog_id_list.push($rootScope.blog_ids.others[i].blog_id);
        }

        for(var i in blog_id_list) {
            GApi.executeAuth('blogger', 'posts.search', {'blogId': blog_id_list[i], 'q': $scope.search_result.keyword}).then(function (resp) {
                $scope.value = resp;
                $scope.search_result.posts.push.apply($scope.search_result.posts,$scope.value.items);
            }, function () {
                console.log("error get post list failed");
            });
        }
        return $q(function(resolve, reject){
            setTimeout(function(){
                if($scope.search_result.posts===[]){
                    reject("No result found");
                }
                else{
                    resolve("Result found")
                }
            }, 1000);
        });
    }

    $scope.search=function(){
        var promise = executeSearch();
        promise.then(
            function(){
                console.log("displayed:"+$scope.blog.posts);
                $scope.blog.posts = $scope.search_result.posts;
            }
        );
    }

    $scope.save_id=function(){
        BlogIdService.setId($rootScope.username, $scope.blog.url).then(
            function(){
                initPost();
                $scope.setId=false;
                $scope.set_id_error = undefined;
            },
            function(msg){
                console.log(msg);
                $scope.set_id_error = msg;
            }
        );

    }




}]);
