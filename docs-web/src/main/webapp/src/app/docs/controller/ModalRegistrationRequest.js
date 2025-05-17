'use strict';

/**
 * Modal registration request controller.
 */
angular.module('docs').controller('ModalRegistrationRequest', function ($scope, $uibModalInstance, Restangular) {
  $scope.request = {
    username: '',
    email: '',
    reason: ''
  };

  // 提交注册请求
  $scope.submit = function () {
    if (!$scope.request.username || !$scope.request.email || !$scope.request.reason) {
      alert('All fields are required!');
      return;
    }

    // 调用注册请求 API
    Restangular.one('user').post('register_request', $scope.request)
      .then(function () {
        alert('Registration request submitted successfully!');
        $uibModalInstance.close();
      })
      .catch(function (error) {
        alert('Error submitting registration request: ' + (error.data.message || 'Unknown error'));
      });
  };

  // 取消模态框
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});