const mongoose = require('mongoose');
const User = require('../model/user')
const {connectDatabase} = require('../config/database')

let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.SECRET;
  passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    const dbcon = await connectDatabase(); 
    User.findById(mongoose.Types.ObjectId(jwt_payload._id), function(err, user) {
          if (err) {
              dbcon.connection.close() 
              return done(err, false);
          }
          if (user) {
              dbcon.connection.close() 
              done(null, user);
          } else {
              dbcon.connection.close() 
              done(null, false);
          }
      });
  }));
};
