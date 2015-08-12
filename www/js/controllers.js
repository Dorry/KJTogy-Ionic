angular.module('kjtogy.controllers', [])

.controller('LoginCtrl', function($scope, parameters, $ionicPlatform, $ionicLoading, $ionicPopup) {
    var app_exit = $ionicPlatform.registerBackButtonAction(function() {
        $ionicPopup.confirm({
            title : '경진토기 APP',
            template : "앱을 종료하시겠습니까?",
            cancelText : '취소',
            okText : '종료',
            okType : 'button-assertive'
        }).then(function(result) {
            if(result) {
                navigator.app.exitApp();
                app_exit();
            }
        }, function(error) {
            console.error("err " + error);
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

.controller('PotDashCtrl', function($scope, $ionicPlatform, $ionicPopover, $ionicPopup, $ionicLoading, $potService, $kjModal) {
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
    function(error) {
        console.error(error);
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

.controller('PotDetailCtrl', function($scope, parameters, $ionicPlatform, $ionicLoading, $ionicPopup, $potService, $kjModal) {
    $ionicLoading.show({
        template:'<ion-spinner icon="android"></ion-spinner> Loading Data...'
    });

    var modal_close = $ionicPlatform.registerBackButtonAction(function() {
        modal_close();
        $scope.closeModal();
    }, 202);

    $scope.$on('$destroy', function() {
        modal_close();
    });

    $scope.close = function() {
        modal_close();
        $scope.closeModal();
    };

    $scope.pot = $potService.getPotById(parameters.id);

    $potService.getImage($scope.pot.pId, 'm').then(
        function(data) {
            if(data === '')
                $scope.image = "http://placehold.it/360x640";
            else
                $scope.image = "data:image/jpeg;base64," + data;

            $ionicLoading.hide();
        },
        function(error) {
            $ionicLoading.hide();
            console.error(error);
        });

    $scope.modify = function(pot) {
        $kjModal.addModPot(angular.copy(pot)).then(function(result) {
        });
    };
})

.controller('PotAddModCtrl', function($scope, parameters, $ionicPlatform, $ionicPopover, $ionicActionSheet, $ionicPopup, $ionicLoading, $potService, $kjCamera, $kjModal) {
    var modal_close = $ionicPlatform.registerBackButtonAction(function() {
        modal_close();
        $scope.closeModal();
    }, 203);

    $scope.potTypes = angular.copy($potService.getPotTypes());
    $scope.potTypes.shift();

    // ionic Popover config
    $ionicPopover.fromTemplateUrl('templates/popover/pot-type.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    },
    function(error) {
        console.error(error);
    });
    // End ionic Popover config

    $scope.showType = function($event) {
        $scope.popover.show($event);
    };

    $scope.closeType = function(value) {
        angular.forEach($scope.potTypes, function(type) {
            if(type.value === value) {
                $scope.pot.potType = type.value;
                $scope.pType = type;
            }
        });

        $scope.popover.hide();
    };

    $scope.$on('$destroy', function() {
        modal_close();
        $scope.popover.remove();
    });
    // end ionic Popover config

    $scope.close = function() {
        modal_close();
        $scope.closeModal();
    };

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
                hideSheet();
                $kjCamera.getPicture(index).then(function(imageData) {
                    $kjModal.preview(imageData).then(function(result) {

                    },
                    function(error) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: error,
                            okText: '확 인',
                            okType: 'button-assertive'
                        });
                        console.error(error);
                    });
                },
                function(error) {
                    console.error(error);
                });
            }
        });
    };

    $scope.done = function(pot) {
        if((angular.isUndefined(pot.potName) || pot.potName == '') ||
          (angular.isUndefined(pot.potPrice) || pot.potPrice == 0)) {
            $ionicPopup.alert({
                title: '필수 항목 미기재',
                template: '필수 입력해야할 항목을 입력하세요!',
                okText: '확 인',
                okType: 'button-assertive'
            });
            return false;
        }

        var params = {
            'potName' : pot.potName,
            'potType' : pot.potType,
            'potPrice' : pot.potPrice,
            'potSize' : pot.potSize || '',
            'potImage' : pot.potImage || '',
            'potTag' : pot.potTag || ''
        };

        if($scope.delBtnHide) { // 상품 추가시
            $potService.addNewPot(params)
            .then(function(result) {
                console.log(result);
                $scope.closeModal();
            },
            function(error) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: error,
                    okText: '확 인',
                    okType: 'button-assertive'
                });
                console.error(error);
            });
        } else { // 상품 수정시
            $potService.updatePot($scope.pot.pId, params)
            .then(function(result) {

                console.log(result);
                $scope.closeModal();
            },
            function(error) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: error,
                    okText: '확 인',
                    okType: 'button-assertive'
                });
                console.error(error);
            });
        }
    };

    // Initialize
    if(angular.isUndefined(parameters.pot) || parameters.pot === null) {
        $scope.title = "상품추가";
        $scope.pot = {
            potName: '',
            potType: $scope.potTypes[0].value,
            potPrice: 0,
            potSize: '',
            potImage: '',
            potTag: ''
        };
        $scope.pType = $scope.potTypes[0];
        $scope.delBtnHide = true;

        $scope.backImage = {'background-image': "url('http://placehold.it/150x150')"};

    } else {
        $ionicLoading.show({
            template:'<ion-spinner icon="android"></ion-spinner> Loading Data...'
        });

        $scope.title = "상품수정";
        $scope.pot = parameters.pot;

        $scope.delBtnHide = false;

        angular.forEach($scope.potTypes, function(type) {
            if(type.value === $scope.pot.potType) {
                $scope.pType = type;
            }
        });

        $potService.getImage($scope.pot.pId, 'm')
        .then(function(data) {
            if(data === '') {
                $scope.backImage = {'background-image': "url('http://placehold.it/150x150')"};
            } else {
                $scope.backImage = {'background-image': "url('data:image/jpeg;base64,".data."')"};
            }
            $ionicLoading.hide();
        },
        function(error) {
            $ionicPopup.alert({
                title: 'Error',
                template: error,
                okText: '확 인',
                okType: 'button-assertive'
            });
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
                        $ionicPopup.alert({
                            title: 'Error',
                            template: error,
                            okText: '확 인',
                            okType: 'button-assertive'
                        });
                        console.error(error);
                    });

                } else {
                    console.log('취소 버튼 눌렀다!!!');
                }
            },
            function(error) {
                console.error("error " + error);
            });
        };
    }
    // End Initialize
})

.controller('PotPreviewCtrl', function($scope, parameters, $ionicPlatform) {
    var modal_close = $ionicPlatform.registerBackButtonAction(function() {
        modal_close();
        $scope.closeModal();
    }, 204);

    $scope.header_view = true;

    $scope.image = "data:image/jpeg;base64,"+parameters.data;

    $scope.displayHeader = function() {
        $scope.header_view = !$scope.header_view;
    };

    $scope.close = function() {
        modal_close();
        $scope.closeModal();
    };

    $scope.$on('$destroy', function() {
        modal_close();
    });
});

