angular.module('docs').controller('AdminController', function ($scope, $http) {
  $scope.requests = [];

  // 加载所有注册请求
  $http.get('/api/registration/requests')
    .then(function (response) {
      $scope.requests = response.data;
    });

  $scope.approveRequest = function (request) {
    // 模拟批准逻辑
    alert('Request approved for: ' + request.username);
  };

  $scope.rejectRequest = function (request) {
    // 模拟拒绝逻辑
    alert('Request rejected for: ' + request.username);
  };
});