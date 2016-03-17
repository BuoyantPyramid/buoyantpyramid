angular.module('jam.profile', [])

.controller('ProfileController', ['$scope', '$location', 'Profile', 'Auth',
function ($scope, loc, Profile, Auth) {
  $scope.user = Auth.getUserData();

  $scope.updateProfile = function () {
    Profile.updateUser($scope.user)
    .then(function (res) {
      console.log('Profile updated', res.data);
      $scope.profile = Auth.getUserData();
      loc.path('/songs');
    })
    .catch(function (error) {
      console.error(error);
    });
  };
  $scope.logout = Auth.logout;
}])
.directive('navBar', [function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      'logout': '&onLogout'
    },
    templateUrl: 'app/nav/nav.html'
  };
}]);