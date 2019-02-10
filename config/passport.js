const GoogleStrategy = require('passport-google-oauth20').Strategy;
FacebookStrategy = require('passport-facebook').Strategy;

const mongoose = require('mongoose');
const keys = require('./keys');

// Load User model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      // console.log(profile);

      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

      const newUser = {
        googleID: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: image
      }

      // check for existing user
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if(user) {
          // Return user
          done(null, user)
        } else {
          // Create user
         new User(newUser)
          .save()
          .then(user => done(null, user)); 
        }
      })
    })
  );

  // Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK_APP_ID,
    clientSecret: keys.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    proxy: true
  },(accessToken, refreshToken, profile, done) => {
    const newUser = {
      facebookID: profile.id,
      email: profile.emails[0].value,
      firstName: profile.displayName,
      lastName: profile.name.familyName
    }
    
    User.findOne({
      facebookID: profile.id
    }).then(user => {
      if(user) {
        // Return user
        done(null, user)
      } else {
        // Create user
       new User(newUser)
        .save()
        .then(user => done(null, user)); 
      }
    })
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}