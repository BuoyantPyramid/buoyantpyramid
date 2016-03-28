angular.module('jam.groups', [])
  
.controller('GroupsController', ['$scope', '$route', 'Users', 'Groups', function($scope, $route, Users, Groups) {
  $scope.user = {};
  $scope.newGroup = {};
  $scope.data = {};
  $scope.chooseRole = {
    role: ''
  };

  $scope.toggleCreateModal = function () {
    $scope.createModalShown = !$scope.createModalShown;
  };

  $scope.memberInfo = function (member, index) {
    $scope.clickedMember = member;
    $scope.clickedMember.isAdmin = member.userGroups.role === 'admin' ? true : false;
    $scope.clickedMember.index = index;
    $scope.chooseRole.role = member.userGroups.role;
    $scope.memberModalShown = true;
  };

  $scope.updateRole = function (userId) {
    if ($scope.chooseRole.role !== $scope.clickedMember.role) {
      Groups.updateUserRole($scope.user.currentGroupId, userId, $scope.chooseRole.role)
      .then(function () {
        $scope.data.members[$scope.clickedMember.index].userGroups.role = $scope.chooseRole.role;
        $scope.memberModalShown = false;
      })
      .catch(console.error);
    }
  };

  $scope.removeMember = function (userId) {
    Groups.removeUser($scope.user.currentGroupId, userId)
    .then(function () {
      // tell the user that the member is no more!
      $scope.data.members.splice($scope.clickedMember.index, 1);
      $scope.memberModalShown = false;
    })
    .catch(console.error);
  };

  $scope.acceptInvite = function (group, index) {
    Groups.updateUserRole(group.id, $scope.user.id, 'member');
    $scope.data.groups[index].userGroups.role = 'member';
  };

  $scope.rejectInvite = function (group, index) {
    Groups.removeUser(group.id, $scope.user.id)
    .then(function (data) {
      console.log(data);
    })
    .catch(console.error);
    console.log(index);
    $scope.data.groups.splice(index, 1);
  };

  $scope.createGroup = function () {
    Groups.createGroup($scope.newGroup)
    .then(function (group) {
      Groups.addUser(group.id, $scope.user.id, 'admin')
      .then(function (user) {
        $scope.createModalShown = false;
        console.log(user);
        console.log(group);
        // $scope.user.currentGroupId = group.id;
        // $scope.user.currentGroup = group;
        // $scope.user.currentGroup.users = [$scope.user];
        // $scope.data.groups.push($scope.user.currentGroup);
        // $scope.data.members = [$scope.user];
        // $scope.updateProfile($scope.user);
      });
    });
  };

  $scope.setCurrentGroup = function(group) {
    Users.updateProfile({currentGroupId: group.id})
    .then(function (res) {
      $scope.user = res.data.user;
      $scope.user.currentGroup = group;
      $scope.data.members = $scope.user.currentGroup.users;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  $scope.updateProfile = function () {
    return Users.updateProfile($scope.user)
    .then(function (res) {
      // $scope.user = res.data.user;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  $scope.isNotCurrentGroup = function (group) {
    return group.id !== $scope.user.currentGroup.id;
  };

  // Load groups and group users
  Users.getUserData()
  .then(function (userData) {
    $scope.user = userData;
    Groups.getGroupsData(userData.id)
    .then(function (groups) {
      // use each, assign current group and put the pending groups into seperate list?
      $scope.data.groups = [];
      $scope.data.pendingGroups = [];
      _.each(groups, function (group) {
        if (group.id === $scope.user.currentGroupId) {
          $scope.user.currentGroup = group;
        }
        if (group.userGroups.role === 'pending') {
          $scope.data.pendingGroups.push(group);
        } else {
          $scope.data.groups.push(group);
        }
      });
      $scope.data.members = $scope.user.currentGroup.users;
    });
  })
  .catch(console.error);
}]);