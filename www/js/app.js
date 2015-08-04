var Secure_Key = "SECURE.KEY";
var doqfhrmdlskey = {u_name:'dorry457',pass:'d4520646'};

angular.module('kjtogy', ['ionic', 'kjtogy.controllers', 'kjtogy.services', 'ngCordova', 'ngMaterial'])

.run(function($ionicPlatform, $cordovaStatusbar) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      $cordovaStatusbar.styleHex('#388E3C');
    }

    window.localStorage.setItem(Secure_Key, JSON.stringify(doqfhrmdlskey));
  });
});
