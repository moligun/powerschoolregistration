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
            let staffObj = {};
            if (user.mail) {
                const powerSchoolAccessToken = await powerSchoolApi.getAccessToken();
                const token = powerSchoolAccessToken.access_token;
                const params = {
                    'email': user.mail
                }
                const staffInfo = await powerSchoolApi.getStaffInfo(token, params);
                const staffObj = staffInfo.record.shift();
                if (staffObj.ps_admin == '1' && staffObj.access_level == '2') {
                    let schoolNumbers = staffObj.schoolaccess_list.split(';');
                    schoolNumbers = schoolNumbers.map(school => school.trim());
                    const schoolsParams = {
                        "school_number": schoolNumbers
                    }
                    const psAdminSchools = await powerSchoolApi.getSchoolsList(token, schoolsParams);
                    user.psAdmin = true;
                    user.psAdminSchools =  psAdminSchools.record !== undefined ? psAdminSchools.record : null;
                }
                user.staffInfo = staffObj;
                console.log(user);
            }
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