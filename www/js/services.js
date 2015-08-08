angular.module('kjtogy.services', [])
.constant('SERVER_REST_URL', 'http://songsul.iptime.org:1590/api')

.factory('$potService', function($http, $q, SERVER_REST_URL) {
    var potItems = [
        {
            pId: 0,
            potName: '2021-W',
            potType: 1,
            potSize: '20.0x24.4x51.7',
            potPrice: 18000,
            potTag: 'LIFE'
        },
        {
            pId: 1,
            potName: '2021-B',
            potType: 3,
            potSize: '20.0x24.4x51.7',
            potPrice: 15000,
            potTag: 'Bicycle'
        },
        {
            pId: 2,
            potName: '2021-A',
            potType: 1,
            potSize: '20.0x24.4x51.7',
            potPrice: 19000,
            potTag: '다이아'
        }
    ];
    
    var potTypes = [
        {name: '모든화분', value: ''},
        {name: '백자화분', value: 1},
        {name: '컬러화분', value: 2},
        {name: '마블화분', value: 3},
        {name: '옹기화분', value: 4},
        {name: '화분받침', value: 5},
        {name: '기타자재', value: 6}
    ];

    return {
        getPotTypes: function() {
            return potTypes;
        },

        getPotsAll : function(refresh) {
            if(!refresh || typeof refresh == 'undefined' || refresh == null)
                return potItems;

            var deferred = $q.defer();
            
            $http.get(SERVER_REST_URL + '/pots')
                .success(function(data) {
                    potItems = data;
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        },

        getPotById : function(id) {
            for(var i=0; i<potItems.length; i++) {
                if(potItems[i].pId == id)
                    return potItems[i];
            }
            return false;
        },

        addNewPot : function(params) {
            var deferred = $q.defer();
            
            $http.post(SERVER_REST_URL + '/pots', params)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        },

        updatePot : function(id, params) {
            var deferred = $q.defer();
            
            $http.put(SERVER_REST_URL + '/pots/' + id, params)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        },

        deletePot : function(id) {
            var deferred = $q.defer();
            
            $http.delete(SERVER_REST_URL + '/pots/' + id)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
        },

        getImage : function(id, size) {
            var deferred = $q.defer();

            $http.get(SERVER_REST_URL + '/images/' + id + '/' + size)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    };
})

.factory('$modalService', function($ionicModal, $rootScope, $q, $injector, $controller) {

    return {
        show: show
    };

    function show(templateUrl, controller, parameters, options) {
        // Grab the injector and create a new scope
        var deferred = $q.defer(),
            ctrlInstance,
            modalScope = $rootScope.$new(),
            thisScopeId = modalScope.$id;

        var parameters = parameters || '';

        var default_options = {
            animation: 'slide-in-up',
            focusFirstInput: false,
            backdropClickToClose : true,
            hardwareBackButtonClose: true,
            modalCallback: null
        };

        options = angular.extend({}, default_options, options);

        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: modalScope,
            animation: options.animation,
            focusFirstInput: options.focusFirstInput,
            backdropClickToClose: options.backdropClickToClose,
            hardwareBackButtonClose: options.hardwareBackButtonClose
        }).then(function (modal) {
            modalScope.modal = modal;

            modalScope.openModal = function () {
                modalScope.modal.show();
            };

            modalScope.closeModal = function (result) {
                deferred.resolve(result);
                modalScope.modal.hide();
            };

            modalScope.$on('modal.hidden', function (thisModal) {
                if (thisModal.currentScope) {
                    var modalScopeId = thisModal.currentScope.$id;
                    if (thisScopeId === modalScopeId) {
                        deferred.resolve(null);
                        _cleanup(thisModal.currentScope);
                    }
                }
            });

            // Invoke the controller
            var locals = { '$scope': modalScope, 'parameters': parameters };
            var ctrlEval = _evalController(controller);
            ctrlInstance = $controller(controller, locals);

            if (ctrlEval.isControllerAs) {
                ctrlInstance.openModal = modalScope.openModal;
                ctrlInstance.closeModal = modalScope.closeModal;
            }

            modalScope.modal.show()
                .then(function() {
                    modalScope.$broadcast('modal.afterShow', modalScope.modal);
                });

            if(angular.isFunction(options.modalCallback)) {
                options.modalCallback(modal);
            }

        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    function _cleanup(scope) {
        scope.$destroy();
        if (scope.modal) {
            scope.modal.remove();
        }
    }

    function _evalController(ctrlName) {
        var result = {
            isControllerAs: false,
            controllerName: '',
            propName: ''
        };

        var fragments = (ctrlName || '').trim().split(/\s+/);
        result.isControllerAs = fragments.length === 3 && (fragments[1] || '').toLowerCase() === 'as';
        if (result.isControllerAs) {
            result.controllerName = fragments[0];
            result.propName = fragments[2];
        } else {
            result.controllerName = ctrlName;
        }

        return result;
    }
})

.factory('$kjModal', function($modalService) {
    return {
        showLogin: showLogin,
        addModPot: addModPot,
        viewDetail: viewDetail,
        preview: preview
    };

    function showLogin() {
        var opts = {
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        };
        return $modalService.show('templates/modal/login.html', 'LoginCtrl', '', opts);
    }

    function addModPot(param) {
        if(param !== null) {
            param = {pot: param};
        }

        return $modalService.show('templates/modal/pot-addmod.html', 'PotAddModCtrl', param);
    }

    function viewDetail(id) {
        return $modalService.show('templates/modal/pot-detail.html', 'PotDetailCtrl', {id: id});
    }

    function preview(data) {
        return $modalService.show('templates/modal/pot-preview.html', 'PotPreviewCtrl', {data: data});
    }
})

.factory('$kjCamera', function($cordovaCamera, $q) {
    return {
        getPicture: getPicture
    };

    function getPicture(type) {
        var deferred = $q.defer();
        var sourceType;

        switch(type) {
            case 0:
                sourceType = Camera.PictureSourceType.CAMERA;
                break;

            case 1:
                sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                break;

            default:
                sourceType = Camera.PictureSourceType.CAMERA;
                break;
        }

        var options = {
            quality: 100,
            targetWidth: 1080,
            targetHeight: 1920,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            deferred.resolve(imageData);
        },
        function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }
})

.filter('won', function($filter) {
   return function(input) {
       var out = (isNaN(input) || input === '' || input === null) ? 0 : input;
       out = Math.abs(out);
       out = $filter('number')(out, 0);

       return '\uFFE6' + out;
   };
})

.filter('potype', function($potService) {
    return function(type) {
        var out = "";

        angular.forEach($potService.getPotTypes(), function(pType) {
            if(pType.value === type)
                out = pType.name;
        });

        return out;
    };
})

.filter('posize', function() {
    return function(size) {
        var sizes = size.split("x");

        if(sizes.length < 3)
            return "지름: " + sizes[0] + ", 높이: " + sizes[1];
        else
            return "가로: " + sizes[0] + ", 세로: " + sizes[1] + ", 높이: " + sizes[2];
    };
})

.filter('typelist', function() {
    return function(pots, type) {
        if(type == '')  return pots;

        var out = [];
        angular.forEach(pots, function(pot) {
            if(pot.potType == type)
                out.push(pot);
        });

        return out;
    };
});
