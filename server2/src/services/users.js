const mongoose = require('mongoose');

const users = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = class UserService {
    init(svcLib, callbackFn) {
        this.svcLib = svcLib;
        users.find(
            {}, (err, data) => {
                if (err) {
                    console.log(err);
                    process.exit(1);
                    return;
                }
                if (data.length == 0) {
                    console.log('0 users found in the database, creating a default user');
                    console.log('admin:admin');
                    this.register('admin', 'admin', (err, data) => {
                        if (err) {
                            console.log(err);
                            process.exit(1);
                            return;
                        }
                        callbackFn();
                    });
                } else callbackFn();
            }
        )
    }
    findUserByName(username, callbackFn) {
        users.findOne(
            { username: username },
            (err, user) => {
                if (err || user === null) callbackFn(false, null);
                else callbackFn(true, user);
            }
        );
    }
    findUserById(id, callbackFn) {
        users.findOne(
            { _id: id },
            (err, user) => {
                if (err || user === null) callbackFn(false, null);
                else callbackFn(true, user);
            }
        )
    }

    login(username, password, callbackFn) {
        var services = this.svcLib.getInstance();
        this.findUserByName(username, (success, user) => {
            if (!success) callbackFn(false, null);
            else
                bcrypt.compare(
                    password, user.password,
                    (err, result) => {
                        if (err || !result) {
                            callbackFn(false, null);
                        }
                        else {
                            services.events.login(username);
                            callbackFn(true, user);
                        }
                    }
                );
        });
    }
    register(username, password, callbackfn) {
        var services = this.svcLib.getInstance();
        var handleError = (err) => {
            console.log(err);
            services.events.error('REGISTER', err.toString());
            callbackfn(err, null);
        };
        bcrypt.hash(password, 10, (err, hashedpw) => {
            if (err) {
                handleError(err);
                return;
            }

            users.create({
                username: username,
                password: hashedpw
            }, (err, data) => {
                if (err) {
                    handleError(err);
                    return;
                }
                services.events.register(username);
                callbackfn(null, data);
            });
        });
    }
}