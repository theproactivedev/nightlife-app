'use strict';

const yelp = require('yelp-fusion');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var express = require("express");
var router = express.Router();
var request = require('request');
var configAuth = require("../config/auth.js");
var Users = require("../models/Users.js");

const yelpId = process.env.YELP_ID;
const yelpSecret = process.env.YELP_SECRET;

module.exports = function(app, passport) {
  var createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    },
    'my-secret',
    {
      expiresIn: 60 * 60 * 24
    });
  };

  var generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
  };

  var sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
  };

  var isContentNotEmpty = function(req, res, next) {
    if (req.body !== undefined) {
      return next();
    }
  };

  var getResults = function(req, res) {
    const searchRequest = {
      term: "restaurant",
      location: req.params.place,
      limit: 10
    };
    var output = [];

    yelp.accessToken(yelpId, yelpSecret).then(yelpRes => {
      const client = yelp.client(yelpRes.jsonBody.access_token);

      client.search(searchRequest).then(response => {
        var firstResult = response.jsonBody.businesses;
        output = firstResult.slice(0);
        // const prettyJson = JSON.stringify(firstResult, null, 4);

        res.json(output);
      });
    }).catch(e => {
      console.log(e);
    });

  };

  var authenticate = expressJwt({
    secret: 'my-secret',
    requestProperty: 'auth',
    getToken: function(req) {
      if (req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
      } else {
        console.log("No token");
      }
      return null;
    }
  });

  var getCurrentUser = function(req, res, next) {
    Users.findOne({
      "_id" : req.auth.id
    }, function(err, user) {
      if (err) {
        next(err);
      } else {
        req.user = user;
        next();
      }
    });
  };

  router.route('/auth/twitter/reverse')
    .post(function(req, res) {
      request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: "https://morning-lake-82922.herokuapp.com/twitter-callback",
          consumer_key: configAuth.twitterAuth.consumerKey,
          consumer_secret: configAuth.twitterAuth.consumerSecret
        }
      }, function (err, r, body) {
        if (err) {
          return res.send(500, { message: err.message });
        }

        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      });
    });

  router.route('/auth/twitter')
    .post((req, res, next) => {
      request.post({
        url: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
        oauth: {
          consumer_key: configAuth.twitterAuth.consumerKey,
          consumer_secret: configAuth.twitterAuth.consumerSecret,
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      }, function (err, r, body) {
        if (err) {
          return res.send(500, { message: err.message });
        }
        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);
        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;

        next();
      });
    }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
        if (!req.user) {
          return res.send(401, 'User Not Authenticated');
        }

        // prepare token for API
        req.auth = {
          id: req.user.id
        };


        return next();
      }, generateToken, sendToken);


  app.route('/search/:place').get(getResults);

  app.route('/addingUserReservation')
  .post(authenticate, getCurrentUser,
    isContentNotEmpty,
    function(req, res) {
    var obj = {
      businessId: req.body.businessId
    };

    Users.update(
      {"_id": req.auth.id},
      {$push : { "reservations": obj } },
      {upsert: true, new: true},
      function(err) {
        if (err) console.log(err);
      }
    );
  });

  app.route('/removingUserReservation')
  .post(authenticate, getCurrentUser,
    isContentNotEmpty, function(req, res) {
      console.log("Id: " + req.body.identification);
    Users.findOneAndUpdate(
      {"_id": req.auth.id},
      {$pull : { "reservations" : { businessId : req.body.identification } } },
      function(err) {
        if (err) console.log(err);
      }
    );
  });

  app.route("/userReservations")
  .get(authenticate, getCurrentUser, function(req, res) {
    Users.findOne({
      "_id": req.auth.id
    }, function(err, data) {
      if (err) {
        console.log(err);
      }

      if(data) {
        res.json(data);
      }
    });
  });

  app.route("/savingSearchedPlace")
  .post(authenticate, getCurrentUser,
    isContentNotEmpty, function(req, res) {

    Users.findOneAndUpdate(
      {"_id": req.auth.id},
      {$set : { "searchedPlace" : req.body.place} },
      function(err) {
        if (err) console.log(err);
      }
    );

  });

  app.route('/').get(function(req, res) {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });

  app.use('/api/v1', router);

};
