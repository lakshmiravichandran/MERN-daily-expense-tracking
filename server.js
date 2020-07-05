// init project
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

const setUpPassport = require("./setuppassport");


// Establish a connection with the Mongo Database
// Get the username, password, host, and databse from the .env file
const mongoDB = ("mongodb+srv://" +
  process.env.USERNAME +
  ":"
  + process.env.PASSWORD +
  "@"
  + process.env.HOST +
  "/"
  + process.env.DATABASE);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, retryWrites: true });
setUpPassport();


const app = express();

// set the view engine
app.set("view engine", "ejs")
app.set("views", [__dirname + "/views/", __dirname + "/views/components"]);

// make all the files in 'public' available, use strict
app.use(express.static('public'));    

// Set up the session middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Using connect-mongo for session storage
// https://www.npmjs.com/package/connect-mongo
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection, autoRemove: 'native' })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Load routes
const routes = require("./routes.js");

app.use(routes);

//MCB: I added arguments here to prevent this from triggering accidentally.
// handle error
app.use(function(err, req, res, next) {
  res.status(404).render("error", {
    title: "404",
    message: "Page Not Found"
  })
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
