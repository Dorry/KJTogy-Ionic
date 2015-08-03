angular.module('kjtogy.services', [])
.constant('SERVER_REST_URL', 'http://songsul.iptime.org:1590/api')

.factory('$potService', function($http, $q, SERVER_REST_URL) {
    var potItems = [
        {
            pId: 0,
            potName: '2021-W',
            potSize: '20.0x24.4x51.7',
            potPrice: 18000,
            potTag: ''
        },
        {
            pId: 1,
            potName: '2021-B',
            potSize: '20.0x24.4x51.7',
            potPrice: 15000,
            potTag: ''
        },
        {
            pId: 2,
            potName: '2021-A',
            potSize: '20.0x24.4x51.7',
            potPrice: 19000,
            potTag: ''
        }
    ];
    
    return {
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

        addNewPot : function() {
            var deferred = $q.defer();
            
            $http.post(SERVER_REST_URL + '/pots')
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
        }
    };
})

.factory('$modalService', function($ionicModal, $rootScope, $q, $injector, $controller) {

    return {
        show: show
    };

    function show(templateUrl, controller, parameters) {
        // Grab the injector and create a new scope
        var deferred = $q.defer(),
            ctrlInstance,
            modalScope = $rootScope.$new(),
            thisScopeId = modalScope.$id;

        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: modalScope,
            animation: 'slide-in-up'
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

            modalScope.modal.show();

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

.filter('won', function($filter) {
   return function(input)  {
       var out = (isNaN(input) || input === '' || input === null) ? 0 : input;
       out = Math.abs(out);
       out = $filter('number')(out, 0);

       return '\uFFE6' + out;
   };
});
