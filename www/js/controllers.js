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
        if(typeof user == 'undefined' || user == null ||
          (user.u_name == "" || user.u_pass == "" || user.u_name != secure.u_name || user.u_pass != secure.pass)) {
            $scope.user = {};

            $ionicLoading.hide();

            $ionicPopup.alert({
                title:'로그인 오류',
                template:'잘못된 정보를 입력하셨습니다.<br> 확인하시고 다시 입력해주세요!',
                okType:'button-assertive'
            });
            return;
        }

        $ionicLoading.hide();
        $state.go('pot.dash');
    };
})

.controller('PotDashCtrl', function($scope, $ionicHistory, $state, $potService) {
    $ionicHistory.clearHistory();

    $scope.pots = $potService.getPotsAll();
    $scope.addNewPot = function() {
        $state.go('pot.add');
    };

    console.info($ionicHistory.viewHistory());
})

.controller('PotDetailCtrl', function($scope, $ionicHistory, $stateParams, $potService) {
    $scope.pot = $potService.getPotById($stateParams.potId);

    console.info($ionicHistory.viewHistory());
})

.controller('PotAddCtrl', function($scope, $stateParams, $potService) {
    $scope.done = function() {

    };
})

.controller('PotModifyCtrl', function($scope, $stateParams, $potService) {
    $scope.pot = $potService.getPotById($stateParams.potId);

    $scope.backImage = {'background-image':"url('http://placehold.it/150x150')"};

    $scope.done = function(pot) {
        var params = {
            'name' : pot.potName,
            'size' : pot.potSize,
            'price' : pot.potPrice,
            'tag' : pot.potTag
        };

        $potService.updatePot($stateParams.potId, params).then(function(result) {}, function(error) {});
    };
});

