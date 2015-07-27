/*
 *
 * PIPELINE DIRECTIVES
 *
 *
 * */
Gateway.directive('slPipelineMainView', [
  '$log',
  'GatewayServices',
  function($log, GatewayServices) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.main.html',
      link: function(scope, el, attrs) {
        var pipelineId = scope.pipelineCtx.currentInstanceId;
        $log.log(pipelineId);

        if (pipelineId) {
          GatewayServices.getPipelineById(pipelineId)
            .then(function(data){
              scope.pipelineCtx.currentPipeline = data;
            });
        }
      }
    }
  }
]);
Gateway.directive('slPipelineForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.form.html',
      scope: {
        pipeline: '=',
        context: '=',
        hidebuttons: '=',
        isModal: '='
      },
      controller: function($scope, GatewayServices) {
        $scope.availablePolicies = [];
        $scope.showAddPolicyMenu = false;

        getPolicies();

        function getPipelineRenderPolicy(policyId) {
          for (var i = 0;i  < $scope.context.policies.length;i++) {
            var item = $scope.context.policies[i];
            if (item.id === policyId) {
              return item;
              break;
            }
          }
        }
        $scope.addNewPolicyToPipeline = function(policy, toggler){
          $scope.pipeline.policyIds = $scope.pipeline.policyIds || [];
          $scope.pipeline.policyIds.push(policy.id);
          $scope.pipeline.renderPolicies = [];
          $scope.pipeline.policyIds.map(function(policyId) {
            var xxx = getPipelineRenderPolicy(policyId);
            $scope.pipeline.renderPolicies.push(xxx)

          });

          $scope.showAddPolicyMenu = false;
        };


        $scope.toggleShowAddPolicyMenu = function(){
          $scope.showAddPolicyMenu = !$scope.showAddPolicyMenu;
        };

        $scope.deletePolicy = function(policy){
          var idx = _.findIndex($scope.pipeline.policies, { id: policy.id });

          $scope.pipeline.policies.splice(idx, 1);
        };

        $scope.savePipeline = function(pipeline){
          GatewayServices.savePipeline($scope.pipeline)
            .$promise
            .then(function(data) {
              $scope.pipeline = {};
              //refreshPipelines();
            });
        };

        //helper functions
        function getPolicies(){
          GatewayServices.getPolicies()
            .then(function(data){
              $scope.availablePolicies = data;
            });
        }
      }
    }
  }
]);
Gateway.directive('slPipelineList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/gateway/templates/pipeline.list.html'
    }
  }
]);
