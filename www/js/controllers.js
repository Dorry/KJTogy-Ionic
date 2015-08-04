angular.module('kjtogy.controllers', [])

.controller('LoginCtrl', function($scope, parameters, $ionicPlatform, $ionicLoading, $ionicPopup) {
    var app_exit = $ionicPlatform.registerBackButtonAction(function() {
        $ionicPopup.confirm({
            title : '경진토기 APP',
            template : "앱을 종료하시겠습니까?",
            cancelText : '취소',
            okText : '종료',
            okType : 'button-assertive'
        }).then(function(res) {
            if(res) {
                navigator.app.exitApp();
                app_exit();
            }
        }, function(err) {
            console.error("err " + err);
        });

    }, 201);

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
        $scope.closeModal(true);
    };
})

.controller('PotDashCtrl', function($scope, $ionicPlatform, $potService, $kjModal) {
    $ionicPlatform.ready(function() {
        $scope.pots = [];

        $scope.isLogin = false;

        if(!$scope.isLogin) {
            $kjModal.showLogin().then(function(result) {
                $scope.isLogin = result;
                $scope.pots = $potService.getPotsAll();
                $scope.potTypes = $potService.getPotTypes();
                $scope.pType = '';
            });
        }

        var app_exit = $ionicPlatform.registerBackButtonAction(function() {
            $ionicPopup.confirm({
                title : '경진토기 APP',
                template : "앱을 종료하시겠습니까?",
                cancelText : '취소',
                okText : '종료',
                okType : 'button-assertive'
            }).then(function(res) {
                if(res) {
                    navigator.app.exitApp();
                    app_exit();
                }
            }, function(err) {
                console.error("err " + err);
            });

        }, 101);

    });

    $scope.viewDetail = function(index) {
        console.log(index);
        $kjModal.viewDetail(index).then(function(result) {

        });
    };

    $scope.addNewPot = function() {
    };
})

.controller('PotDetailCtrl', function($scope, parameters, $potService, $kjModal) {
    $scope.pot = $potService.getPotsAll()[parameters.index];

    $scope.modify = function(pot) {
        $kjModal.modifyPot(pot).then(function(result) {
            if(angular.isDefined(result) || result != null) {
                console.log("Detaile view's result is " + result);
            }
        });
    };
})

.controller('PotAddCtrl', function($scope, $potService) {
    $scope.done = function() {

    };
})

.controller('PotModifyCtrl', function($scope, parameters, $ionicActionSheet, $ionicPopup, $potService) {
    $scope.pot = parameters.pot;

    $scope.backImage = {'background-image':"url('http://placehold.it/150x150')"};

    $scope.changeImage = function() {
        var hideSheet = $ionicActionSheet.show({
            titleText: '사진 선택',
            buttons: [
                {text: '<i class="icon ion-camera"></i>카메라'},
                {text: '<i class="icon ion-image"></i>사진 앨범'}
            ],
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
            if(res) {
                console.log('삭제 버튼 눌렀다!!!');

                $potService.deletePot($scope.pot.potId)
                .then(function(result) {
                    console.log(result);
                    $scope.closeModal();
                },
                function(error) {
                    console.error(error);
                });

            } else {
                console.log('취소 버튼 눌렀다!!!');
            }
        }, function(err) {
            console.error("err " + err);
        });
    };

    $scope.done = function(pot) {
        var params = {
            'name' : pot.potName,
            'size' : pot.potSize || '',
            'price' : pot.potPrice,
            'tag' : pot.potTag || ''
        };

        $potService.updatePot(pot.potId, params)
        .then(function(result) {
            console.log(result);
            $scope.closeModal();
        },
        function(error) {
            console.error(error);
        });
    };
});

