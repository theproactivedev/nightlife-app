const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const routes = require("./app/routes/index.js");
require('./app/config/passport.js')(passport);
const app = express();
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};

app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, 'client/build')));
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(process.env.PORT || 3001, function() {
	console.log("Working");
});
