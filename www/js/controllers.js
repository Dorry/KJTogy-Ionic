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

.controller('PotModifyCtrl', function($scope, $stateParams, $ionicActionSheet, $ionicPopup, $potService) {
    $scope.pot = $potService.getPotById($stateParams.potId);

    $scope.backImage = {'background-image':"url('http://placehold.it/150x150')"};

    $scope.changeImage = function() {
        var hideSheet = $ionicActionSheet.show({
            titleText: '사진 선택',
            buttons: [
                {text: '<i class="icon ion-camera"></i>카메라'},
                {text: '<i class="icon ion-image"></i>사진 앨범'}
            ],
            destructiveText: '<i class="icon ion-trash-b" style="color:#ff0000"></i>삭제',
            destructiveButtonClicked: function() {
                console.warn('삭제버튼 눌러졌습니다.');
            },
            cancelText: '취소',
            cancel: function() {
                hideSheet();
            },
            buttonClicked: function(index) {
                console.log(index + '번째 버튼 눌러졌습니다.');
            }
        });
    };

    $scope.deletePot = function() {
        $ionicPopup.confirm({
            title : $scope.pot.potName + ' 자료 삭제',
            template : "정말 '" + $scope.pot.potName + "' 자료를 삭제하시겠습니까?",
            cancelText : '취소',
            okText : '삭제',
            okType : 'button-assertive'
        }).then(function(res) {
            console.log('삭제 버튼 눌렀다!!!');

            $potService.deletePot($stateParams.potId).then(function(result) {}, function(error) {});
        }, function(err) {
            console.log('취소 버튼 눌렀다!!!');
        });
    };

    $scope.done = function(pot) {
        var params = {
            'name' : pot.potName,
            'size' : pot.potSize || '',
            'price' : pot.potPrice,
            'tag' : pot.potTag || ''
        };

        $potService.updatePot($stateParams.potId, params).then(function(result) {}, function(error) {});
    };
});

