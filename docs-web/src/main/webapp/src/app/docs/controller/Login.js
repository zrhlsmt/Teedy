'use strict';

/**
 * Login controller.
 */
angular.module('docs').controller('Login', function(Restangular, $scope, $rootScope, $state, $stateParams, $dialog, User, $translate, $uibModal) {
  $scope.codeRequired = false;

  // Get the app configuration
  Restangular.one('app').get().then(function(data) {
    $rootScope.app = data;
  });

  // Login as guest
  $scope.loginAsGuest = function() {
    $scope.user = {
      username: 'guest',
      password: ''
    };
    $scope.login();
  };
  
  // Login
  $scope.login = function() {
    User.login($scope.user).then(function() {
      User.userInfo(true).then(function(data) {
        $rootScope.userInfo = data;
      });

      if($stateParams.redirectState !== undefined && $stateParams.redirectParams !== undefined) {
        $state.go($stateParams.redirectState, JSON.parse($stateParams.redirectParams))
          .catch(function() {
            $state.go('document.default');
          });
      } else {
        $state.go('document.default');
      }
    }, function(data) {
      if (data.data.type === 'ValidationCodeRequired') {
        // A TOTP validation code is required to login
        $scope.codeRequired = true;
      } else {
        // Login truly failed
        var title = $translate.instant('login.login_failed_title');
        var msg = $translate.instant('login.login_failed_message');
        var btns = [{result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary'}];
        $dialog.messageBox(title, msg, btns);
      }
    });
  };

  // Password lost
  $scope.openPasswordLost = function () {
    $uibModal.open({
      templateUrl: 'partial/docs/passwordlost.html',
      controller: 'ModalPasswordLost'
    }).result.then(function (username) {
      if (username === null) {
        return;
      }

      // Send a password lost email
      Restangular.one('user').post('password_lost', {
        username: username
      }).then(function () {
        var title = $translate.instant('login.password_lost_sent_title');
        var msg = $translate.instant('login.password_lost_sent_message', { username: username });
        var btns = [{result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary'}];
        $dialog.messageBox(title, msg, btns);
      }, function () {
        var title = $translate.instant('login.password_lost_error_title');
        var msg = $translate.instant('login.password_lost_error_message');
        var btns = [{result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary'}];
        $dialog.messageBox(title, msg, btns);
      });
    });
  };

  $scope.openRegistrationRequestModal = function () {
    $uibModal.open({
      templateUrl: 'partial/docs/registrationRequestModal.html',
      controller: function ($scope, $uibModalInstance, $http) {
        $scope.request = {};
  
        $scope.submitRequest = function () {
          Restangular.one('user').post('register_request', $scope.request)
          .then(function () {
            alert('Registration request submitted successfully!');
            $uibModalInstance.close();
          })
          .catch(function (error) {
            alert('Error submitting registration request: ' + (error.data.message || 'Unknown error'));
          });
        };
  
        $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };
      }
    });
  };

  // $scope.goToRegister = function() {
  //   $state.go('settings.user.register.html'); // 跳转到注册页面的路由
  // };

  // $scope.saveToFile = function() {
  //   const userData = {
  //     username: $scope.newUser.username,
  //     email: $scope.newUser.email,
  //     password: $scope.newUser.password
  //   };

  //   $http.post('/api/saveToFile', userData)
  //     .then(function(response) {
  //       alert('Data saved to file successfully!');
  //     })
  //     .catch(function(error) {
  //       alert('Error saving data to file: ' + error.data.message);
  //     });
  // };
});