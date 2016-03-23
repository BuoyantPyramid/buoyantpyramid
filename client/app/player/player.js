angular.module('jam.player', [])
.controller('PlayerController', ['$scope', 'ngAudio', 'Songs', function($scope, audio, Songs) {
  $scope.playlist = Songs.getSoundsAndIndex();
  $scope.placeholderSound = audio.load('http://mattyluv.com/mp3/hickey_various/Hickey-ElFarolito.mp3');
  $scope.sound = $scope.playlist.sounds ? $scope.playlist.sounds[$scope.playlist.index] : $scope.placeholderSound;
  
  var changeSong = function() {
    $scope.sound.stop();
    $scope.playlist = Songs.getSoundsAndIndex();
    $scope.sound = $scope.playlist.sounds[$scope.playlist.index];
    if ($scope.playlist.playing) {
      $scope.sound.play();
    }
    $scope.sound.complete(function() {
      Songs.nextIndex();
    });
  };

  $scope.sound.complete(function() {
    Songs.nextIndex();
  });

  Songs.registerObserverCallback(changeSong);
}]);
