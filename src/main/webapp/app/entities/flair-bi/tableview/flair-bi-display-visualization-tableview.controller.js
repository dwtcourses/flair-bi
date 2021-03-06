(function () {
    'use strict';

    angular
        .module('flairbiApp')
        .controller('FlairBiDisplayVisualizationTableviewController', FlairBiDisplayVisualizationTableviewController);
    FlairBiDisplayVisualizationTableviewController.$inject = ['$scope',
        "$rootScope",
        "$stateParams",
        "proxyGrpcService",
        "stompClientService",
        "AuthServerProvider",
        "schedulerService",
        "REPORTMANAGEMENTCONSTANTS"
    ];

    function FlairBiDisplayVisualizationTableviewController($scope,
        $rootScope,
        $stateParams,
        proxyGrpcService,
        stompClientService,
        AuthServerProvider,
        schedulerService,
        REPORTMANAGEMENTCONSTANTS) {
        var vm = this;
        vm.id = $stateParams.id;
        vm.tableData = [];
        vm.tablekey = [];
        vm.reportData;
        vm.dateFormat = REPORTMANAGEMENTCONSTANTS.dateTime;
        activate();
        ///////////////

        function activate() {

            schedulerService.getReportLogByMetaId($stateParams.id)
                .then(
                    function (response) {
                        vm.reportData = response.data.reportLog;
                        var info = {
                            text: 'Report will be execute now',
                            title: 'Success'
                        };
                        connectWebSocket();

                        proxyGrpcService.forwardCall($stateParams.datasource, {
                            queryDTO: response.data.reportLog.query
                        });
                    },
                    function (error) {
                        var info = {
                            text: 'error occured while cancelling scheduled report',
                            title: "Error"
                        };
                        $rootScope.showErrorSingleToast(info);
                    });
        }

        function connectWebSocket() {
            stompClientService.connect(
                { token: AuthServerProvider.getToken() },
                function (frame) {
                    stompClientService.subscribe("/user/exchange/metaData", onExchangeMetadata);
                    stompClientService.subscribe("/user/exchange/metaDataError", onExchangeMetadataError);
                }
            );

            $scope.$on("$destroy", function (event) {
                stompClientService.disconnect();
            });
        }

        function onExchangeMetadataError(data) {
        }


        function onExchangeMetadata(data) {
            var metaData = JSON.parse(data.body);
            createHeader(metaData.data[0]);
            addDataInTable(metaData.data);


        }
        function createHeader(cols) {
            $("#table-view-col-" + vm.id + "").empty();
            var row = $("#table-view-col-" + vm.id + "");
            angular.forEach(cols, function (value, key) {
                row.append("<th>" + key + "</th>");
            });
        }

        function addDataInTable(data) {
            $("#table-view-" + vm.id + " > tbody").empty();
            var tBody = $("#table-view-" + vm.id + " > tbody");
            angular.forEach(data, function (row, index) {
                var tr = $("<tr></tr>");
                angular.forEach(row, function (value, key) {
                    tr.append("<td>" + value + "</td>");
                });
                tBody.append(tr);
            });
        }

    }
})();
