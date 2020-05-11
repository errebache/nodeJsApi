const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require("mongoose");
const config = require("./config/database");

const app = express();
// Port Number
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  // authorized headers for preflight requests
  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();

  app.options('*', (req, res) => {
      // allowed XHR methods  
      res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
      res.send();
  });
});

//connect to database
mongoose.connect(config.database,(err) => {
  if(err) throw err;
   else console.log(`Connected to database ${config.database}`);
})
const users = require("./src/routes/user");
const tasks = require("./src/routes/tasks");
const projects = require("./src/routes/projects");

app.use(cors());

app.use('/uploads',express.static('uploads'));

// body parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users',users);

app.use("/tasks",tasks);

app.use("/projects",projects);

// Index Route
app.get('/', (req, res) => {
    res.send('hello user');
  });
  
// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});