var myApp = angular.module('appOne', ["channelManager", "ngMaterial", "angular-dialgauge", "angular-scriptrui"]);

myApp.config(function (WSProvider) {
	WSProvider.setWsUrl('wss://api.scriptrapps.io/RTg2MTczN0ZDRQ==');
    WSProvider.setPublishChannel("scriptrUIpublish");
    WSProvider.setSubscribeChannel("scriptrUIsubscribe");
});



//Extend angular widgets, to bind to server on their model change
myApp.directive('mdSwitch', requireExtensionDirective);
myApp.directive('mdSlider', requireExtensionDirective);