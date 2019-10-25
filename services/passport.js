const config = require('../config.js');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const loginApi = require('./loginapi');
const User = require('./users');
const powerSchoolApi = require('./powerschoolapi');
module.exports = function() {
    const oauthClient = new OAuth2Strategy(
        config.passport, 
        (acessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    );
    oauthClient.userProfile = async (accessToken, done) => {
        let profile, user;
        try {
            profile = await loginApi.getMemberProfile(accessToken);
            user = await User.findOrCreate(profile)

        } catch (error) {
            console.log(error);
            return done(error);
        }
        console.log(user);
        return done(null, user);
    }
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = {}
        try {
            user = await User.find(id)
            user.displayName = user.firstname + ' ' + user.lastname
        } catch(error) {
            return done(error, user)
        }
        return done(null, user)
    });
    passport.use(oauthClient);
    return passport;
}
