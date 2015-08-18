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
        if(typeof user == 'undefined' || user == null || (user.u_name == "" || user.u_pass == "")) {
            $scope.user = {};

            $ionicLoading.hide();

            $ionicPopup.alert({
                title:'로그인 오류',
                template:'잘못된 정보를 입력하셨습니다.<br> 확인하시고 다시 입력해주세요!',
                okType:'button-assertive'
            });
            return;
        } else {
            for(u in secure) {
                if(u.u_name == user.u_name) {
                    if(u.pass != user.u_pass) {
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
                    return true;
                }
            }

            $scope.user = {};

            $ionicLoading.hide();

            $ionicPopup.alert({
                title:'로그인 오류',
                template:'잘못된 정보를 입력하셨습니다.<br> 확인하시고 다시 입력해주세요!',
                okType:'button-assertive'
            });
            return;
        }

    };
})

.controller('PotDashCtrl', function($scope, $ionicPlatform, $ionicPopover, $ionicPopup, $ionicLoading, $potService, $kjModal) {
    $ionicPlatform.ready(function() {
        $scope.randomBackColor = ["#7ab815", "#beb016", "#58bacb", "#cb6b6b", "#9f7aff", "#cacaca"];

        $scope.pots = [];

        $scope.isLogin = false;

        if(!$scope.isLogin) {
            $kjModal.showLogin().then(function(result) {
                $ionicLoading.show({
                    template:'<ion-spinner icon="android"></ion-spinner> Loading Data...'
                });

                $scope.isLogin = result;
                $potService.getPotsAll().then(
                    function(data) {
                        $scope.pots = data;
                        $ionicLoading.hide();
                    },
                    function(error) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Error',
                            template: error,
                            okText: '확 인',
                            okType: 'button-assertive'
                        });

                        console.error(error);
                    });

                $scope.potTypes = $potService.getPotTypes();
                $scope.pType = $scope.potTypes[0];

                $scope.doRefresh = function() {
                    $potService.getPotsAll().then(
                        function(data) {
                            $scope.pots = data;
                        },
                        function(error) {
                            $ionicPopup.alert({
                                title: 'Error',
                                template: error,
                                okText: '확 인',
                                okType: 'button-assertive'
                            });

                            console.error(error);
                        })
                    .finally(function() {
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                };
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

    $scope.viewDetail = function(id) {
        console.log(id);
        $kjModal.viewDetail(id).then(function(result) {});
    };

    $scope.addNewPot = function() {
        $kjModal.addModPot(null).then(function(result) {});
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

    $potService.getImage($scope.pot.pId, 'mm').then(
        function(data) {
            if(data === '')
                $scope.image = "img/no-data-flowerpot-360.png";
            else
                $scope.image = "data:image/jpeg;base64," + data;

            $scope.viewImage = function() {
                if(data !== '') {
                    $ionicLoading.show({
                        template:'<ion-spinner icon="android"></ion-spinner> Loading Original Image...'
                    });

                    $potService.getImage($scope.pot.pId, 'b').then(
                        function(imageData) {
                            $ionicLoading.hide();
                            $kjModal.preview(imageData).then(function(result) {},
                            function(error) {
                                $ionicPopup.alert({
                                    title: 'Error',
                                    template: error,
                                    okText: '확 인',
                                    okType: 'button-assertive'
                                });
                                console.error(error);
                            });
                        });
                }
            };

            $ionicLoading.hide();
        },
        function(error) {
            $scope.image = "img/no-data-flowerpot-360.png";

            $ionicLoading.hide();
            console.error(error);
        });

    $scope.modify = function(pot) {
        $kjModal.addModPot(angular.copy(pot)).then(function(result) {
        });
    };
})

.controller('PotAddModCtrl', function($scope, parameters, $ionicPlatform, $ionicPopover, $ionicActionSheet, $ionicPopup, $ionicLoading, $cordovaToast, $potService, $kjCamera, $kjModal) {
    var pot_image_data;
    var modal_close = $ionicPlatform.registerBackButtonAction(function() {
        delete pot_image_data;
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
        delete pot_image_data;
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
                    pot_image_data = imageData;
                    $scope.backImage = {
                        'background-image': "url(data:image/jpeg;base64,"+imageData+")",
                        'background-size' : "cover",
                        'background-position' : "center"
                    };
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
            'potImage' : pot_image_data || '',
            'potTag' : pot.potTag || ''
        };

        $ionicLoading.show({
            template:'<ion-spinner icon="android"></ion-spinner> 자료 업로드중...'
        });

        if($scope.delBtnHide) { // 상품 추가시
            var d = new Date();
            angular.extend(params, {'createdAt' : d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()});

            $potService.addNewPot(params)
            .then(function(result) {
                $ionicLoading.hide();
                $cordovaToast.showShortBottom('자료 업로드 성공.');
                console.log(result);
                $scope.closeModal();
            },
            function(error) {
                $ionicLoading.hide();
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
                $ionicLoading.hide();
                $cordovaToast.showShortBottom('자료 업로드 성공.');
                console.log(result);
                $scope.closeModal();
            },
            function(error) {
                $ionicLoading.hide();
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
            potPrice: '',
            potSize: '',
            potImage: '',
            potTag: ''
        };
        $scope.pType = $scope.potTypes[0];
        $scope.delBtnHide = true;

        $scope.backImage = {'background-image': "url('img/no-data-flowerpot-150.png')",
                            'background-color': "#cacaca"};

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
                $scope.backImage = {'background-image': "url('img/no-data-flowerpot-150.png')",
                                    'background-color': "#cacaca"};
            } else {
                $scope.backImage = {'background-image': "url(data:image/jpeg;base64,"+data+")"};
            }
            $ionicLoading.hide();
        },
        function(error) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Error',
                template: error,
                okText: '확 인',
                okType: 'button-assertive'
            });
            $scope.backImage = {'background-image': "url('img/no-data-flowerpot-150.png')",
                                'background-color': "#cacaca"};
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

