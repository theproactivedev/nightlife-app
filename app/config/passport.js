'use strict';

var TwitterTokenStrategy = require('passport-twitter-token');
var Users = require('../models/Users');
var configAuth = require('./auth');

module.exports = function (passport) {

  passport.use(new TwitterTokenStrategy({
      consumerKey: configAuth.twitterAuth.consumerKey,
      consumerSecret: configAuth.twitterAuth.consumerSecret
    },
    function (token, tokenSecret, profile, done) {
      Users.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
    });
  }));

  // passport.serializeUser(function(user, done) {
  //   console.log("Serialize");
  //   console.log(user.id + " - User id");
  //   done(null, user.id);
  // });
  //
  // passport.deserializeUser(function(id, done) {
  //   console.log("Deserialize");
  //   console.log(user.id + " - User id");
  //   Users.findById(id, function (err, user) {
  //     done(err, user);
  //   });
  // });


};
