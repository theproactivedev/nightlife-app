const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});

var routes = require("./app/routes/index.js");
require('./app/config/passport.js')(passport);
var app = express();

// var Users = require("./app/models/Users.js");
// Users.remove({}, function (err) {
//   console.log(err);
// });

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, 'client/public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'votingApp',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(process.env.PORT, function() {
	console.log("Working");
});
