angular.module('kjtogy.controllers', ['kjtogy.services'])

.directive('potList', function() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<ion-list ng-transclude></ion-list>'
    };
})

.directive('potItem', function() {
    return {
        restrict: 'E',
        require: '^potList'
        scope: {
            item: '=data'
        },
        templateUrl: 'templates/pot-item.html'
    };
})

.controller('PotDashCtrl', function($scope, $potService) {
    $scope.pots = [];
})

.controller('PotDetailCtrl', function($scope, $stateParams, $potService) {
    $scope.title = "백자";
});
