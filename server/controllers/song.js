var path = require('path');
var db = require('../db/database');
var fs = require('fs');
var Song = db.Song;
var Group = db.Group;


var addSong = function(req, res, next) {
  console.log('Receive song data: ', req.body);

  var dateRecorded = req.body.lastModified || null;
  var dateUploaded = Date.now(); //TODO: make a db entry for this data
  var groupId = req.params.id;
  var name = req.body.name || '';
  var description = req.body.description || '';
  var size = req.body.size;
  var awsBucketAddress = '';
  var uniqueHash = req.body.uniqueHash;

  console.log('Hash name: ', uniqueHash);

  Song.create({
    title: name,
    description: description,
    dateRecorded: dateRecorded, // TODO: Receive from UI?
    dateUploaded: dateUploaded, //TODO: ask erick is this in the db schema?
    size: size, // TODO: ask erick if this size is in db?
    duration: 100, // TODO: Receive from UI?
    uniqueHash: uniqueHash, //TODO: ask erick about this one too..
    address: awsBucketAddress,
    groupId: groupId
  }, {
    include: {
      model: Group
    }
  })
  .then(function(song) {
    res.json(song);
  })
  .catch(function(err) {
    next(err);
  });
};

var getSongByFilename = function(req, res, next) {
  var filename = req.params.filename;
  var url = path.resolve(__dirname + '/../uploadInbox/' + filename);
  res.sendFile(url);
};

var deleteSong = function(req, res, next) {
  var songId = req.params.id;
  Song.findById(songId)
  .then(function(song) {
    var url = path.resolve(__dirname + '/../uploadInbox/' + song.address);
    fs.unlink(url, function(err, status) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        song.destroy()
        .then(function() {
          res.json(song);
        });
      }
    });
  })
  .catch(function(err) {
    next(err);
  });
};

module.exports = {
  addSong: addSong,
  getSongByFilename: getSongByFilename,
  deleteSong: deleteSong
};
