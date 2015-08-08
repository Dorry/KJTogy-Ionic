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

.controller('PotDashCtrl', function($scope, $ionicPlatform, $ionicPopover, $ionicPopup, $potService, $kjModal) {
    $ionicPlatform.ready(function() {
        $scope.pots = [];

        $scope.isLogin = false;

        if(!$scope.isLogin) {
            $kjModal.showLogin().then(function(result) {
                $scope.isLogin = result;
                $scope.pots = $potService.getPotsAll();
                $scope.potTypes = $potService.getPotTypes();
                $scope.pType = $scope.potTypes[0];
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

    // ionic Popover config
    $ionicPopover.fromTemplateUrl('templates/popover/pot-type.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    },
    function(err) {
        console.error(err);
    });

    $scope.showType = function($event) {
        $scope.popover.show($event);
    };

    $scope.closeType = function(value) {
        angular.forEach($scope.potTypes, function(type) {
            if(type.value === value)
                $scope.pType = type;
        });

        $scope.popover.hide();
    }
    // end ionic Popover config

    $scope.viewDetail = function(index) {
        console.log(index);
        $kjModal.viewDetail(index).then(function(result) {

        });
    };

    $scope.addNewPot = function() {
        $kjModal.addModPot(null).then(function(result) {

        });
    };
})

.controller('PotDetailCtrl', function($scope, parameters, $potService, $kjModal) {
    $scope.pot = $potService.getPotById(parameters.id);

    $scope.modify = function(pot) {
        $kjModal.addModPot(pot).then(function(result) {
            if(angular.isDefined(result) || result != null) {
                console.log("Detaile view's result is " + result);
            }
        });
    };
})

.controller('PotAddModCtrl', function($scope, parameters, $ionicPopover, $ionicActionSheet, $ionicPopup, $potService, $kjCamera, $kjModal) {
    $scope.potTypes = angular.copy($potService.getPotTypes());
    $scope.potTypes.shift();

    // Initialize
    if(angular.isUndefined(parameters.pot) || parameters.pot === null) {
        $scope.title = "상품추가";
        $scope.pot = {
            potName: '',
            potType: $scope.potTypes[0].value,
            potPrice: 0,
            potSize: '',
            potTag: ''
        };
        $scope.pType = $scope.potTypes[0];
    } else {
        $scope.title = "상품수정";
        $scope.pot = parameters.pot;

        angular.forEach($scope.potTypes, function(type) {
            if(type.value === $scope.pot.potType) {
                $scope.pType = type;
            }
        });

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
    }
    // End Initialize

    $scope.delBtnHide = angular.isUndefined($scope.pot.pId);
    console.log($scope.delBtnHide);

    // ionic Popover config
    $ionicPopover.fromTemplateUrl('templates/popover/pot-type.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    },
    function(err) {
        console.error(err);
    });

    $scope.showType = function($event) {
        $scope.popover.show($event);
    };

    $scope.closeType = function(value) {
        angular.forEach($scope.potTypes, function(type) {
            if(type.value === value) {
                $scope.pot.potType = type.value;
                $scope.pType = type;
                //console.log($scope.pot.potType);
            }
        });

        $scope.popover.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // end ionic Popover config

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
                $kjCamera.getPicture(index).then(function(imageData) {
                    $kjModal.preview(imageData).then(function(result) {

                    },
                    function(err) {
                        console.error(err);
                    });
                },
                function(err) {
                    console.error(err);
                });
            }
        });
    };

    $scope.done = function(pot) {
        if(angular.isUndefined(pot.potName)) {
            alert('상품명을 적어주세요.');
            document.getElementById('potName').focus();
            return;
        }
        else if(angular.isUndefined(pot.potPrice) || pot.potPrice == 0) {
            alert('상품가격을 적어주세요.');
            document.getElementById('potPrice').focus();
            return;
        }

        var params = {
            'name' : pot.potName,
            'size' : pot.potSize || '',
            'price' : pot.potPrice,
            'tag' : pot.potTag || ''
        };

        $potService.addNewPot(params)
        .then(function(result) {
            console.log(result);
            $scope.closeModal();
        },
        function(error) {
            console.error(error);
        });
    };
})

.controller('PotPreviewCtrl', function($scope, parameters) {
    //$scope.data = parameters.data;
    //console.info(parameters.data);
    $scope.image = "data:image/jpeg;base64,"+$scope.data;

});

