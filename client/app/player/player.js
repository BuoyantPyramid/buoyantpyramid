angular.module('jam.player', [])
.controller('PlayerController', ['$scope', 'Songs', function($scope, Songs) {
  $scope.audio = Songs.player;
  $scope.currentTime = 0;
  $scope.song = null;
  $scope.muted = Songs.getMuted();

  setInterval(function() { $scope.$apply(); }, 200);
  
  $scope.$watch(function(scope) {
    return scope.audio.volume;
  }, function(newV) {
    if (newV) {
      Songs.setVolume(newV);  
    } 
  });

  $scope.stop = function () {
    $scope.audio.pause();
    $scope.audio.currentTime = 0;
  };

  $scope.mute = function () {
    if ($scope.muted) {
      $scope.audio.volume = Songs.getVolume();
    } else {
      $scope.audio.volume = 0;
    }
    $scope.muted = !$scope.muted;
    Songs.setMuted($scope.muted);
  };

  $scope.togglePlay = function () {
    if ($scope.audio.paused) {
      $scope.audio.play();
    } else {
      $scope.audio.pause();
    }
  };

  var changeSong = function() {
    $scope.playlist = Songs.getSoundsAndIndex();
    $scope.song = $scope.playlist.songs[$scope.playlist.index];
    $scope.audio.src = $scope.song.compressedAddress ||
      $scope.song.address;
    $scope.audio.onended = Songs.nextIndex;
    $scope.audio.play();
  };

  Songs.registerObserverCallback('CHANGE_SONG', changeSong);
  Songs.registerObserverCallback('TOGGLE_PLAY', $scope.togglePlay);
}]);
