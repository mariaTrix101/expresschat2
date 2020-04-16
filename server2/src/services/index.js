const UserService = require('./users');
const RoomsService = require('./rooms');
const EventsService = require('./events');
const ExpressApi = require('./expressApi');
const SocketIoService = require('./socketio');


class ExpressChatServices {
    constructor() {
        this.events = new EventsService();
        this.users = new UserService();
        this.rooms = new RoomsService();
        this.expressApi = new ExpressApi();
        this.socketIo = new SocketIoService();
    }

    init(svcLib, callbackFn) {
        this.users.init(svcLib, () => {
            this.rooms.init(svcLib);
            this.expressApi.init(svcLib);
            this.socketIo.init(svcLib);
            callbackFn();
        });
    }

    start() {
        this.rooms.prefetch(() => {
            const port = process.env.PORT || 4000;
            this.expressApi.start(port, () => {
                this.socketIo.start();
            });
        });
    }
}

var instance = null;

module.exports = {
    ExpressChatServices: ExpressChatServices,
    getInstance: () => {
        if (instance === null)
            instance = new ExpressChatServices();
        return instance;
    }
};