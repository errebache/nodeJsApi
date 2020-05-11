const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./database');


module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = config.secret;
    console.log(opts);
    passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
      User.getUserById(jwt_payload.data._id, (err, user) => {
        if(err){
          return done(err, false);
        }
  
        if(user){
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }));
    
  }
