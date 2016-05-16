'use strict';
angular.module('myApp.chat_room', ['ngRoute','angular-google-gapi'])
    .config(['$routeProvider', function($routeProvider) {
        //route for my chat page
        $routeProvider.when('/chat_room', {
            templateUrl: 'chat_room/chat_room.html',
            controller: 'ChatRoomCtrl'
        });
        $routeProvider.when('/individual_chat_room', {
            templateUrl: 'chat_room/individual_chat_room.html',
            controller: 'ChatRoomCtrl'
        });

    }])
    .controller('ChatRoomCtrl', [ '$scope','$rootScope', function($scope, $rootScope) {




        //console.log("my username:"+$rootScope.localUsername);
        //
        //console.log("my groupmembers:"+$rootScope.groupMembers);
        //
        //console.log($rootScope.localUsername, $rootScope.localPassword);


        $scope.clearError = function() {
            $('div.error').text("");
        }



        $scope.handleError = function(error) {

            $('div.error').text(error.message);
        }


        /*  $scope.sinchClient.newUser( $scope.loginObject, function(ticket) {
         $scope.sinchClient.start(ticket, function() {
         $scope.global_username = $scope. username;

         }).fail( $scope.handleError);
         }).fail( $scope.handleError);
         */
        //$scope.loginUser=function() {
        //    event.preventDefault();
        //    $('button#createUser').attr('disabled', true);
        //    $('button#loginUser').attr('disabled', true);
        //    $scope.clearError();
        //
        //    $scope.username = $('input#username').val();
        //    $scope.password = $('input#password').val();
        //
        //    $scope.loginObject = {username: $scope.username, password: $scope.password};
        //    $scope.sinchClient.start($scope.loginObject, function() {
        //        $scope.global_username = $scope.username;
        //        $('input#username').val( '');
        //        $('input#password').val( '' );
        //
        //    }).fail($scope.handleError);
        //}
        //
        //$scope.createUser=function(){
        //    event.preventDefault();
        //
        //
        //    $scope.username = $('input#username').val();
        //    $scope.password = $('input#password').val();
        //
        //    $scope.loginObject = {username: $scope.username, password: $scope.password};
        //    $scope.sinchClient.newUser( $scope.loginObject, function(ticket) {
        //        sinchClient.start(ticket, function() {
        //            $scope.global_username =  $scope.username;
        //            $('input#username').val( '');
        //            $('input#password').val( '' );
        //            //  $scope.changeRecipient();
        //        }).fail($scope.handleError);
        //    }).fail($scope.handleError);
        //}
        //
        //
        $scope.receiver=" ";
        $scope.sinchClient = new SinchClient({
            applicationKey: '858acdbb-23ac-4f49-8441-8ca9f69d0236',
            capabilities: {messaging: true},
            startActiveConnection: true,
        });

        $scope.loginObject = {username: $rootScope.localUsername, password: $rootScope.localPassword};


        $scope.sinchClient.start( $scope.loginObject, function() {
            console.log("sinch sucess!");


        });


        $scope.messageClient = $scope.sinchClient.getMessageClient();
        console.log("my message client"+$scope.messageClient);

        ////initial posts
        //function initChat(){
        //
        //    $scope.receipter=$rootScope.groupMembers;
        //
        //}
        $scope.groupChat=function(){
            $scope.receiver=$rootScope.groupMembers;
            $('form#chatArea').empty();
            console.log("multi "+$scope.receiver);
        }
        $scope.getChatWith= function(user){

                $scope.receiver=user;
            $('form#chatArea').empty();
                console.log("single "+$scope.receiver);


        }
        $scope.sendBt=function(){
            event.preventDefault();
            $scope.clearError();

            $scope.text = $('input#message').val();
            $('input#message').val('');
            $scope.sinchMessage = $scope.messageClient.newMessage($scope.receiver,$scope.text);
            console.log( $scope.sinchMessage);
            $scope.messageClient .send($scope.sinchMessage).fail($scope.handleError);
        }

        /*  $scope.eventListener = {
         onIncomingMessage: function(message) {
         if (message.senderId == $scope.global_username) {

         $('div#chatArea').append('<div>' + $scope.global_username+": "+message.textBody + '</div>');
         } else {
         $('div#chatArea').append('<div style="color:red;">' + ": "+message.textBody
         + '</div>');
         }

         }
         }
         */







        $scope.eventListener = {


            onIncomingMessage: function(message) {



                $('form#chatArea').append('<form class="msgRow" id="'+message.messageId+'"></form>' +
                    '<div class="clearfix"></div>');

                $scope.textScroll=document.getElementById("chatArea");
                $scope.textScroll.scrollTop= 9999999;

                $('form.msgRow#'+message.messageId)
                    .attr('class',$rootScope.localUsername == message.senderId ? 'me' : 'other')
                    .append([
                        '<form id="from">'+
                        ($rootScope.localUsername== message.senderId ? '<div style="color:rgba(0, 0, 135, 0.58); font-size: 20px; ' +
                        'font-family: "Courier New", Courier, monospace>'+ 'Me : '+
                        message.textBody+ '</div>' : '<div style=" color:rgba(163, 84, 31, 0.6);font-size: 20px;">'+message.senderId+' : '
                        + message.textBody+'</div>')+'</form>',
                        '<div class="recipients"></div>'
                    ]);
            }
        }


        $scope.messageClient.addEventListener($scope.eventListener);

      $scope.eventListenerDelivery = {
            onMessageDelivered: function(messageDeliveryInfo) {
                //$('div#'+messageDeliveryInfo.messageId+' div.recipients').append(messageDeliveryInfo.recipientId + ' ');
                $('form#chatArea'+messageDeliveryInfo.messageId+' div.recipients').append('<img src="style/delivered_green.png" ' +
                    'title="'+messageDeliveryInfo.recipientId+'">');
            }
        }

        $scope. messageClient.addEventListener($scope.eventListenerDelivery);


    }]);