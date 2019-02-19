const config = require('./config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');

// JWT Strategy Options
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.authentication.secretOrPrivateKey;

/**
 * Passport Strategy
 * Request Headers requires valid "Authorization" value.
 * @param passport
 */
module.exports = passport => {
    passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if(user) {
                    return done(null, user);
                } else {
                    console.log('Auth - User not found.')
                }
                return done(null, false);
            })
            .catch(err => {
                console.log(err);
            });
    }))
}