angular.module('kjtogy.controllers', [])

.directive('potList', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<ion-list ng-transclude></ion-list>'
    };
})

.directive('potItem', function() {
    return {
        restrict: 'E',
        replace: true,
        require: '^potList',
        scope: {
            item: '=data'
        },
        templateUrl: 'templates/pot-item.html'
    };
})

.controller('LoginCtrl', function($scope, $ionicNavBarDelegate, $state, $ionicLoading, $ionicPopup) {
    $ionicNavBarDelegate.showBar(false);
    $ionicNavBarDelegate.showBackButton(false);

    $scope.login = function(user) {
        $ionicLoading.show({
            template: '개인정보 인증중...'
        });

        var secure = JSON.parse(window.localStorage.getItem(Secure_Key));
        if(user.u_name != "" && user.u_pass != "" && user.u_name == secure.u_name && user.u_pass == secure.pass) {
            $ionicLoading.hide();
            $state.go('pot.dash');
        } else {
            $scope.user = {};

            $ionicLoading.hide();

            $ionicPopup.alert({
                title:'로그인 오류',
                template:'잘못된 정보를 입력하셨습니다.<br> 확인하시고 다시 입력해주세요!',
                okType:'button-assertive'
            });
        }
    };
})

.controller('PotDashCtrl', function($scope, $ionicHistory, $state, $potService) {
    $scope.pots = $potService.getPots();
    $scope.addNewPot = function() {
        $state.go('pot.add');
    };

    console.info($ionicHistory.viewHistory());
})

.controller('PotDetailCtrl', function($scope, $ionicHistory, $stateParams, $potService) {
    $scope.title = $potService.getPot($stateParams.potId).potName;

    console.info($ionicHistory.viewHistory());
})

.controller('PotAddCtrl', function($scope, $stateParams, $potService) {
    $scope.done = function() {

    };
});

