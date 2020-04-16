const passport = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

module.exports = (svcLib) => {
    const services = svcLib.getInstance();
    passport.use(new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, callback) {
            services.users.login(
                username, password, (loggedIn, user) => {
                    if (!loggedIn || loggedIn === null)
                        return callback(null, false, {
                            message: 'Invalid username/password'
                        });
                    else {
                        return callback(null, true, user);
                    }
                }
            );
        }
    ));
    passport.use(
        new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : 'secretkey'
        },
        function (jwtPayload, callback) {
            services.users.findUserById(
                jwtPayload.id, (user) => {
                    if (user) callback(null, user);
                    else return callback({error: 'Failed login'});
                }
            );
        }
    ));
};