const socketio = require('socket.io');
const eventNames = require('./eventNames');
const events = require('../../models/event');

const Client = require('./client');

module.exports = class SocketIoService {
    constructor() {
        this.clients = {};
    }

    init(svcLib) {
        this.svcLib = svcLib;
    }

    start() {
        var services = this.svcLib.getInstance();
        this.io = socketio(services.expressApi.httpServer);
        var thisObj = this;
        this.io.on(eventNames.Connection, function(socket) {
            var client = new Client(thisObj.svcLib, socket);
            client.onDisconnect(() => delete this.clients[socket.id]);
            client.start(
                services.rooms.defaultRoom(),
                () => thisObj.clients[client.id] = client
            );
        });
    }


    getClientsInRoom(roomId) {
        var clients = [];
        Object.keys(this.clients).forEach(e => {
            var client = this.clients[e];
            if (client === undefined || client == null) return;
            var currentRoom = client.currentRoom;
            if (currentRoom === undefined || currentRoom == null) return;
            if (currentRoom._id === roomId)
                clients.push(client.profile());
        });
        return clients;
    }

    roomDeleted(roomId, newRoom) {
        for (var key in Object.keys(this.clients)) {
            var client = this.clients[key];
            if (client && client.currentRoom && client.currentRoom._id == roomId) {
                client.leaveRoom(roomId);
                client.joinRoom(newRoom)
            }
        }
    }
}