angular.
  module('channelManager', ['ngWebSocket']).
   provider('WS',  function wsProvider() {
      var wsUrl = null;
      var publishChannel = null;
 	  var subscribeChannel = null;

      this.setWsUrl = function (textString) {
      	wsUrl = textString;
      };

	  this.setPublishChannel = function (textString) {
      	publishChannel = textString;
      };

	  this.setSubscribeChannel = function (textString) {
      	subscribeChannel = textString;
      };

      this.$get = ["$websocket", function wsFactory($websocket) {
      //Open a WebSocket connection
      var dataStream = $websocket(wsUrl);
      var collection = {};
      dataStream.onOpen(function() {
        dataStream.send(JSON.stringify({
            "method":"Subscribe",
            "params":{
              "channel": subscribeChannel
            }
          }))
      });
        
      dataStream.onMessage(function(message) {
         collection["data"] = JSON.parse(message.data);
      });
        
      var methods = {
        collection: collection,
        send: function(message) {
          dataStream.send({
               "method":"Publish",
               "params":{
                 "channel": publishChannel,
               	 "message": JSON.stringify(message)
               }
          });
        }
      };
     return methods;
	}]
}).controller("ScriptrRLTController", function WdgController($scope, $rootElement, WS, $attrs) {
   $scope.msg = WS.collection;
   $scope.data = {};
   $scope.$watch('msg', function (newVal, oldVal) {
      if (typeof newVal !== 'undefined') {
         if($scope.msg["data"] && $scope.msg["data"] && $scope.msg["data"]["appId"] == $rootElement.attr('ng-app')) {
              $scope.data[$scope.msg["data"]["widgetId"]] = {"value": $scope.msg["data"]["payload"]};
         }
      }
  }, true);
  
  
  $scope.update = function(value, key) {
      var widgetId = key.replace("data.","").replace(".value", "");
      WS.send({appId: $rootElement.attr('ng-app'), widgetId: widgetId , payload: value});
  };
})

//Used to extend widgets, to bind to server their model changes.
//Widgets need to have ng-change="updateServer();
function requireExtensionDirective() {
	return {
    	priority: 10000,
        link: function(scope, element, attrs) {
          if (attrs.ngChange == "updateServer()") {
             attrs.$set('ngChange', 'update('+attrs.ngModel+',"'+attrs.ngModel+'")')
          }
      }
	};
}