const passport = require('passport');
const passportauth = require('./passport');
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');


module.exports = class ExpressApi {
    constructor() {
        this.expressApp = express();
        this.httpServer = http.Server(this.expressApp);
    }
    init(svcLib) {
        this.svcLib = svcLib;
    }
    start(port, callbackFn) {
        passportauth(this.svcLib);

        this.httpServer.listen(port);
        this.httpServer.on('listening', () => {
            console.log("Listening on %s ", this.httpServer.address());
            callbackFn();
        });

        this.expressApp.use(cors());
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({extended: false}));
        this.expressApp.use(
            express.static(
                path.join(
                    __dirname,
                    "..", "..", "..",
                    "client"
                )
            )
        );

        this.expressApp.use(
            require('./routes/auth')(this.svcLib)
        );
        this.expressApp.use(
            passport.authenticate('jwt', {session: false}),
            require('./routes/events')()
        );
        this.expressApp.use(
            passport.authenticate('jwt', {session: false}),
            require('./routes/rooms')(this.svcLib)
        );
    }
};