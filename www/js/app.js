var Secure_Key = "SECURE.KEY";
var doqfhrmdlskey = [{u_name:'dorry457',pass:4365}, {u_name:'flowerpig82',pass:1590}];

angular.module('kjtogy', ['ionic', 'kjtogy.controllers', 'kjtogy.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
        StatusBar.backgroundColorByHexString('#388e3c');
    }

    window.localStorage.setItem(Secure_Key, JSON.stringify(doqfhrmdlskey));
  });
});
