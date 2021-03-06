var jwt = require('jsonwebtoken');
var config = require('../config/config.js');
var db = require('../db/database');
var User = db.User;
var JWT_SECRET = config.JWT_SECRET || 's00p3R53kritt';

var errorLogger = function (error, req, res, next) {
  // log the error then send it to the next middleware in
  console.error(error.stack);
  next(error); 
};

var errorHandler = function (error, req, res, next) {
  // send error message to client
  // message for gracefull error handling on app
  res.status(500).json({error: error.message});
};

var verifyToken = function (req, res, next) {
  
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var tokenUser;

  if (!token) {
    res.status(401).json('No authentication token');
  } else {
    // decode token and attach user to the request
    // for use inside our controllers
    jwt.verify(token, JWT_SECRET, function(err, tokenUser) {
      if (err) {
        res.status(401).json('Bad authentication token');
      } else {     
        // check against database
        if (tokenUser.id && tokenUser.email) {
          User.findOne({
            where: {id: tokenUser.id, email: tokenUser.email},
            attributes: { exclude: ['password'] }
          })
          .then(function(user) {
            req.user = user;
            next();
          });
        } else {
          res.status(404).json('no user associated with that authentication token');
        }
      }
    });
  }
};


module.exports = {
  errorLogger: errorLogger,
  errorHandler: errorHandler,
  verifyToken: verifyToken
};
