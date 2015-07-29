angular.module('kjtogy.services', [])
.constant('SERVER_REST_URL', 'http://songsul.iptime.org:1590/api')

.factory('$potService', function($http, $q, SERVER_REST_URL) {
    var potItems = [
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
})

.filter('won', function($filter) {
   return function(input)  {
       var out = (isNaN(input) || input === '' || input === null) ? 0 : input;
       out = Math.abs(out);
       out = $filter('number')(out, 0);

       return '\uFFE6' + out;
   };
});
