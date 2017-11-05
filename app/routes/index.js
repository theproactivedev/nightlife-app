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
    }, 'my-secret',
    {
      expiresIn: 60 * 120
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
      console.log("Content loaded");
    }
  };

  var getResults = function(req, res) {
    const searchRequest = {
      term: req.body.term,
      location: req.body.city,
      cll: req.body.loc
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

    // console.log("Req.user.id: " + req.user.id);
    // console.log("Req.auth.id: " + req.auth.id);
    console.log("Req.headers: " + req.headers["x-auth-token"]);

  };

  router.route('/auth/twitter/reverse')
    .post(function(req, res) {
      request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: "http://localhost:3000/twitter-callback",
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
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
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

        console.log(body);
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

        console.log("Req user id" + req.user.id);

        return next();
      }, generateToken, sendToken);

  app.use('/api/v1', router);

  app.route('/search').post(isContentNotEmpty, getResults);

  app.route('/addingUserReservation').post(function(req, res) {
    var obj = {
      businessId: req.body.businessId,
      name: req.body.name,
      url: req.body.url,
      address: req.body.address
    }

    Users.findOneAndUpdate(
      {"twitterProvider.identification": req.body.userId},
      {$push : { "reservations": obj } },
      {upsert: true, new: true},
      function(err) {
        if (err) console.log(err);
      }
    );
  });

  app.route("/userReservations").post(function(req, res) {
    Users.find({
      "twitterProvider.identification": req.body.userId
    }, function(err, data) {
      if (err) {
        console.log(err);
      }

      // if(data.reservations.length > 0) {
      //   res.json(data.reservations);
      // }

      if(data) {
        res.json(data);
      }
    });
  });

};
