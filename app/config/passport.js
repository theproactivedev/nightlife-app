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

};
