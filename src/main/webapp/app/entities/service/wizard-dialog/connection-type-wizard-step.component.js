(function() {
    "use strict";

    angular.module("flairbiApp").component("connectionTypeWizardStep", {
        templateUrl:
            "app/entities/service/wizard-dialog/connection-type-wizard-step.component.html",
        controller: ConnectionTypeWizardStepController,
        controllerAs: "vm",
        bindings: {
            selectedService: "=",
            service: "=",
            connectionType: "=",
            connectionTypes: "=",
            connections: "="
        }
    });

    ConnectionTypeWizardStepController.$inject = ["Connections","$rootScope"];
    function ConnectionTypeWizardStepController(Connections,$rootScope) {
        var vm = this;

        vm.selectCt = selectCt;
        vm.loadConnections = loadConnections;
        ////////////////

        function selectCt(ct) {
            vm.connectionType = ct;
        }

        /**
         * Load connections for the selected connection type
         */
        function loadConnections() {
            $rootScope.$broadcast('flairbiApp:data-connection:next-page');
            vm.connections = Connections.query({
                connectionType: vm.connectionType.id
            });
        }

        vm.$onInit = function() {};
        vm.$onChanges = function(changesObj) {};
        vm.$onDestroy = function() {};
    }
})();
