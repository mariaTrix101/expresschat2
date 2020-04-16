const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');


module.exports = (svcLib) => {
    const router = express.Router();
    const services = svcLib.getInstance();

    function login(res, callbackFn) {
        return passport.authenticate(
            'local', { session: false }, (err, result, info) => {
                if (!result) {
                    res.status(400).json({
                        error: true,
                        info: info
                    });
                } else {
                    callbackFn(info);
                }
            }
        );
    }

    router.post(
        '/api/login',
        (req, res) => {
            login(res, (user) => {
                req.login(user, {session: false}, (err) => {
                    if (err)
                        res.send(error);
                    else {
                        const userData = {
                            id: user._id.toString(),
                            username: user.username
                        };

                        const token = jwt.sign(userData, 'secretkey');
                        return res.json({
                            user: userData,
                            token: token
                        });
                    }
                })
            })(req, res);
        }
    );

    function isUndefinedOrEmpty(val) {
        return val === undefined || val.length === 0;
    }

    router.post(
        '/api/register',
        (req, res) => {
            var body = req.body;
            if (isUndefinedOrEmpty(body.username) || isUndefinedOrEmpty(body.password)) {
                return res.status(400).json({
                    error: true,
                    info: { message: 'Missing credentials' }
                });
            }
            services.users.register(
                body.username, body.password, (err, user) => {
                    if (err) {
                        if (err.code === 11000) { // Duplicate key
                            console.log("Duplicate register for " + body.username);
                            res.status(400).json({
                                error: true,
                                info: { message: 'User is already registered' } 
                            });
                        }
                        else {
                            console.log(err);
                            res.status(500).json({
                                error: true,
                                info: { message: 'An error occurred, try again later' }
                            });
                        }
                        return;
                    }
                    res.status(200).json({error: false, message: 'done'});
                }
            );
        }
    );

    return router;
};