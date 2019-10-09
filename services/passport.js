const config = require('../config.js');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const loginApi = require('./loginapi');
const powerSchoolApi = require('./powerschoolapi');
module.exports = function() {
    const oauthClient = new OAuth2Strategy(
        config.passport, 
        (acessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    );
    oauthClient.userProfile = async (accessToken, done) => {
        let user = {};
        try {
            user = await loginApi.getMemberProfile(accessToken);
        } catch (error) {
            console.log(error);
            return done(error);
        }
        return done(null, user);
    }
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(oauthClient);
    return passport;
}
