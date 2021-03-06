(function () {
    'use strict';

    angular
        .module('flairbiApp')
        .component('filterPaneWidgetComponent', {
            templateUrl: 'app/entities/flair-bi/filter/filter-pane-widget.component.html',
            controller: filterPaneWidgetComponent,
            controllerAs: 'vm',
            bindings: {
                dimensions: '=',
                view: '='
            }
        });

    filterPaneWidgetComponent.$inject = ['$scope', '$rootScope', 'filterParametersService', 'FilterStateManagerService', 'VisualDispatchService'];

    function filterPaneWidgetComponent($scope, $rootScope, filterParametersService, FilterStateManagerService, VisualDispatchService) {
        var vm = this;

        vm.filter = filter;
        vm.onClearClick = onClearClick;
        vm.selectedFilters = {};
        vm.list={};
        activate();

        ////////////////

        function activate() {
            var unsub = $scope.$on('flairbiApp:clearFilters', function () {
                clear();
            });

            $scope.$on('$destroy', unsub);
            filterChangedSubscription();
        }

        function filterChangedSubscription() {
            var unsubscribe = $scope.$on('filterParametersService:filter-changed', function (event, newFilter) {
                vm.selectedFilters = newFilter;
            });

            $scope.$on('$destroy', unsubscribe);
        }

        function onClearClick() {
            $rootScope.$broadcast("flairbiApp:clearFilters");
        }

        function clear() {
            $rootScope.updateWidget = {};
            vm.dimensions.forEach(function (item) {
                item.selected = null;
                item.selected2 = null;
            });
            filterParametersService.clear();
            filterParametersService.saveSelectedFilter($rootScope.updateWidget);
            filter();
        }

        function filter() {
            filterParametersService.save(filterParametersService.getSelectedFilter());
            $rootScope.updateWidget = {};
            $rootScope.$broadcast('flairbiApp:filter');
            $rootScope.$broadcast('flairbiApp:filter-add');
        }
    }
})();
