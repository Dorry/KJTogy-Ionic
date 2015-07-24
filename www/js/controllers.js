angular.module('kjtogy.controllers', [])

.directive('potList', function() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<ion-list ng-transclude></ion-list>'
    };
})

.directive('potItem', function() {
    return {
        restrict: 'E',
        require: '^potList',
        scope: {
            item: '=data'
        },
        templateUrl: 'templates/pot-item.html'
    };
})

.controller('LoginCtrl', function($scope, $ionicNavBarDelegate, $state, $ionicPopup) {
    $ionicNavBarDelegate.showBar(false);
    $ionicNavBarDelegate.showBackButton(false);

    $scope.login = function(user) {
        var secure = JSON.parse(window.localStorage.getItem(Secure_Key));
        if(user.u_name != "" && user.u_pass != "" && user.u_name == secure.u_name && user.u_pass == secure.pass) {
            $state.go('tab.pot-dash');
        } else {
            $scope.user = {};

            $ionicPopup.alert({
                title:'로그인 오류',
                template:'잘못된 정보를 입력하셨습니다.<br> 확인하시고 다시 입력해주세요!',
                okType:'button-assertive'
            });
        }
    };
})

.controller('PotDashCtrl', function($scope, $potService) {
    $scope.pots = [];
})

.controller('PotDetailCtrl', function($scope, $stateParams, $potService) {
    $scope.title = "백자";
})

.controller('AccountCtrl', function($scope) {

});
