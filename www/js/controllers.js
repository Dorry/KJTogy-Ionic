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
            $state.go('tab.pot-dash');
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

.controller('PotDashCtrl', function($scope, $potService) {
    $scope.pots = [
        {
            pId: 0,
            potName: '2021-W',
            potSize: '20.0x24.4x51.7',
            price: 18000
        },
        {
            pId: 1,
            potName: '2021-B',
            potSize: '20.0x24.4x51.7',
            price: 15000
        },
        {
            pId: 2,
            potName: '2021-A',
            potSize: '20.0x24.4x51.7',
            price: 19000
        }
    ];
})

.controller('PotDetailCtrl', function($scope, $stateParams, $potService) {
    $scope.title = "백자";
})

.controller('AccountCtrl', function($scope) {

});
