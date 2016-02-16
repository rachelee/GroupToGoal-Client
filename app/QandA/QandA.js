'use strict';

var app = angular.module('myApp.QandA', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/QandA', {
    templateUrl: 'QandA/QandA.html',
    controller: 'QandACtrl'
  });
}])

app.controller('QandACtrl', ['$scope', '$http',function($scope, $http) {
    $scope.article={

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
    var id;
    $scope.submitForm=function(){
        console.log("posting data...");
        $http({
            method: "POST",
            url: 'http://localhost:8080/publish',
            data: $scope.article,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .success(function(data){
                id=data.id;
                console.log(id);
                $scope.article={};
            });

        console.log("Result: ",$scope.article);
    };



}]);

