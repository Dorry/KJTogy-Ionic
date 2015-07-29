var Secure_Key = "SECURE.KEY";
var doqfhrmdlskey = {u_name:'dorry457',pass:'d4520646'};

angular.module('kjtogy', ['ionic', 'kjtogy.controllers', 'kjtogy.services', 'ngCordova'])

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

    window.localStorage.setItem(Secure_Key,JSON.stringify(doqfhrmdlskey));
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
  })

  .state('pot', {
      url: '/pot',
      abstract: true,
      template: '<ion-nav-view></ion-nav-view>'
  })

  .state('pot.dash', {
      url: '/dash',
      templateUrl: 'templates/pot-dash.html',
      controller: 'PotDashCtrl'
  })

  .state('pot.detail', {
      url: '/detail/:potId',
      templateUrl: 'templates/pot-detail.html',
      controller: 'PotDetailCtrl'
  })

  .state('pot.add', {
      url: '/add',
      templateUrl: 'templates/pot-add.html',
      controller: 'PotAddCtrl'
  })

  .state('pot.modify', {
      url: '/modify/:potId',
      templateUrl: 'templates/pot-modify.html',
      controller: 'PotModifyCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
