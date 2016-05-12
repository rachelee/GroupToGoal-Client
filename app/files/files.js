'use strict';
angular.module('myApp.files', ['ngRoute'])
    .controller('FilesCtrl', [ '$scope', '$rootScope', 'GApi', function($scope, $rootScope) {
	        $rootScope.menu=true;

	        $scope.createFolder = function(){
	        	var name = $scope.folder_name || "Group Folder";
	        	gapi.client.load('drive', 'v2', function(){
			        var request = gapi.client.request({
			          'path': '/drive/v2/files',
			          'method': 'POST',
			          'body':{
			            "title" : name,
	              		"mimeType" : "application/vnd.google-apps.folder"
			          }
			        });
			        alert(name + " is successufully created!");

			        request.execute(function(resp){
			        	var folderId = resp.id;
			            //alert(folderId);

			            var emails = $rootScope.groupMemberGmails;
			            
			            for(var i = 0; i < emails.length; i++){
			            	$scope.insertPermission(folderId, emails[i], "user", "writer");
			            }
			            //$scope.insertPermission(resp.id, email, "user", "writer");
			            
			        });
        	    });
	        };

	        $scope.insertPermission = function(fileId, value, type, role){
	        	var body = {
			        'value': value,
			        'type': type,
			        'role': role
      			};
      			var request = gapi.client.drive.permissions.insert({
			        'fileId': fileId,
			        'resource': body
			    });
      			request.execute(function(resp) {console.log(resp); });
	        };

	        $scope.test = function(){
	        	alert('Works!');
	        };
    	}
    ]);




