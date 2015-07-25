var Secure_Key = "SECURE.KEY";
var doqfhrmdlskey = {u_name:'dorry457',pass:'d4520646'};

angular.module('kjtogy', ['ionic', 'kjtogy.controllers', 'kjtogy.services', 'FilterServices'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    window.localStorage.setItem(Secure_Key,JSON.stringify(doqfhrmdlskey));
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
  })

  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.pot-dash', {
    url: '/pot',
    views: {
      'pot-tab': {
        templateUrl: 'templates/pot-dash.html',
        controller: 'PotDashCtrl'
      }
    }
  })

  .state('pot-detail', {
      url: '/pot/:potId',
      templateUrl: 'templates/pot-detail.html',
      controller: 'PotDetailCtrl'
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'account-tab': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
