var app = angular.module('channelManager', ['ngWebSocket'])

app.provider('WS', function wsProvider() {
      var url = config.service+config.token
      var publishChannel = config.publishChannel
      var subscribeChannel = config.subscribeChannel

      this.$get = [
        "$websocket", 
        function wsFactory($websocket) {
          //Open a WebSocket connection
          var dataStream = $websocket(url);
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
})
    
app.controller("ScriptrRTController", function widgetUpdate($scope, $rootElement, WS, $attrs) {
   $scope.msg = WS.collection;
   $scope.data = {};
   $scope.$watch('msg', function (newVal, oldVal) {
      if (typeof newVal !== 'undefined') {
         if($scope.msg["data"] && $scope.msg["data"]["appId"] == $rootElement.attr('ng-app')) {
              $scope.data[$scope.msg["data"]["widgetId"]] = {"value": $scope.msg["data"]["payload"]};
         }
      }
  }, true);
  
  
  $scope.update = function(value, key) {
      var widgetId = key.replace("data.","").replace(".value", "");
console.debug(value, key)    
      WS.send({appId: $rootElement.attr('ng-app'), widgetId: widgetId , payload: value});
  };
})

/* 
 *
 */ 

// Extend widgets to enable server biding
scriptr = {
  enableServerBinding: function (widgets) {
    for (var i=0; i<widgets.length; i++) 
      myApp.directive(widgets[i], function() {
        return {
            priority: 10000,
            link: function(scope, element, attrs) {
              if (attrs.scriptrBind == "true") {
                 attrs.$set('ngChange', 'update('+attrs.ngModel+',"'+attrs.ngModel+'")')
              }
          }
        }
      })
  }
}
