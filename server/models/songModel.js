var db = require('../db/database');
var Song = db.Song;

var addSong = function (songData) {
  return Song.create(songData);
};

var getSong = function(songId) {
  // Only deletes from the database. FILES ARE STILL ON S3!
  return Song.findById(songId);
};

module.exports = {
  addSong: addSong,
  getSong: getSong
};