const rooms = require('../models/room');
const db = require('../database');
const eventNames = require('./socketio/eventNames.js')

module.exports = class RoomsService {
    constructor() {
        this.rooms = {};
    }
    init(svcLib) {
        this.svcLib = svcLib;
    }

    defaultRoom() { return Object.keys(this.rooms)[0]; }

    getAll() { return Object.values(this.rooms); }
    get(roomId) { return this.rooms[roomId]; }

    prefetch(callbackFn) {
        rooms.find({}, (err, data) => {
            if (err) {
                console.log('Error retrieving rooms');
                console.log(err);
                process.exit(1);
            }
            else if (data.length == 0) {
                console.log('0 rooms found in the database, creating a default room');
                this.create('Default', 'home', (_, data) => {
                    this.rooms[data._id.toString()];
                    callbackFn();
                });
            }
            else {
                data.forEach(room => {
                    var id = room._id.toString();
                    room._id = id;
                    this.rooms[id] = room;
                });
                callbackFn();
            }
        });
    }

    update(id, updateData, callbackFn) {
        rooms.updateOne({_id: id}, updateData, (err, data) => {
            if (!err) {
                var room = this.rooms[id];
                room.name = updateData.name;
                room.icon = updateData.icon;
                this.notifyRoomsChanged();
                callbackFn(null, room);
                return;
            }
            db.handle_result(err, data, callbackFn);
        })
    }
    delete(id, callbackFn) {
        if (this.rooms.length == 1) {
            console.log("Tried to remove last room");
            callbackFn({error: true, info: {message: "Not removing the only chatroom, create another one and then delete this one."}}, null);
        }
        rooms.find({_id: id}).deleteOne((err, data) => {
            if (!err) {
                delete this.rooms[id];
                this.notifyRoomsChanged();
                this.svcLib.getInstance().socketIo.roomDeleted(id, this.defaultRoom());
            }
            db.handle_result(err, data, callbackFn);
        });
    }

    create(name, icon, callbackFn) {
        rooms.create(
            {
                name: name,
                icon: icon
            },
            (err, data) => {
                if (!err) {
                    this.saveRoom(data);
                    this.notifyRoomsChanged();
                }
                db.handle_result(err, data, callbackFn);
            }
        );
    }

    notifyRoomsChanged() {
        var io = this.svcLib.getInstance().socketIo.io;
        if (io && io.sockets)
            io.sockets.emit(eventNames.GetRoomsResponse, this.getAll());
    }
    saveRoom(room) {
        this.rooms[room._id.toString()] = room;
    }
};