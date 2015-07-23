angular.module('kjtogy.services', [])
.constant('SERVER_REST_URL', 'http://songsul.iptime.org:1590/api')

.factory('$potService', function($http, $q, SERVER_REST_URL) {
    var potItems = [];
    
    return {
        getPotsAll : function() {
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
            var deferred = $q.defer();
            
            $http.get(SERVER_REST_URL + '/pots/' + id)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            
            return deferred.promise;
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
            
            $http.put(SERVER_REST_URL + '/pots/' + id)
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
});