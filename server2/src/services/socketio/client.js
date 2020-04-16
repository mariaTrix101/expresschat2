const eventNames = require('./eventNames');

module.exports = class Client {
    constructor(svcLib, socket) {
        this.id = null;
        this.svcLib = svcLib;
        this.socket = socket;

        this.username = 'Person';
        this.currentRoom = null;
        this._disconnectFn = null;
    }

    start(defaultRoom, callbackFn) {
        var services = this.svcLib.getInstance();
        services.events.connection(this.address(), (_, data) => {
            this.id = data._id.toString();
            this._hookupEvents();
            callbackFn();
            this.changeRoom(defaultRoom);
        });
    }

    address() { return this.socket.conn.remoteAddress; }
    profile() {
        return {
            id: this.id,
            username: this.username,
            room: this.currentRoom._id
        }
    }
    onDisconnect(callbackFn) {
        this._disconnectFn = callbackFn;
    }

    leaveRoom() {
        if (this.currentRoom === null) return;
        var profile = this.profile();
        this.emitToRoom(eventNames.UserLeftRoom, profile);
        this.roomSystemMessage(
            this.currentRoom._id, `${profile.username} has left the room`,
            () => {
                    this.socket.leave(this.currentRoom._id);
                this.currentRoom = null;
            },
            false
        );
    }

    changeRoom(newRoom) {
        var services = this.svcLib.getInstance();
        this.leaveRoom();
        services.events.roomChange(
            this.id,
            this.username,
            newRoom
        );

        this.currentRoom = services.rooms.get(newRoom);
        this.socket.join(newRoom);
        this.socket.emit(
            eventNames.RoomChangeResponse,
            {
                room: this.currentRoom._id,
                users: services.socketIo.getClientsInRoom(
                    this.currentRoom._id
                )
            }
        );
        this.emitToRoom(eventNames.UserJoinedRoom, this.profile());
        this.roomSystemMessage(newRoom, `${this.username} has joined the room`);
    }

    emitToRoom(eventName, data, includeThis = false) {
        var broadcast = null;
        if (includeThis)
            broadcast = this.svcLib.getInstance().socketIo.io.sockets
        else
            broadcast = this.socket.broadcast;

        if (this.currentRoom !== null)
            broadcast.to(this.currentRoom._id).emit(
                eventName, data
            );
    }

    roomSystemMessage(roomId, message, callbackFn = null, includeSelf = true) {
        this.svcLib.getInstance().events.message(
            0, this.username,
            roomId, message,
            (err, data) => {
                this.emitToRoom(
                    eventNames.RoomMessage,
                    {
                        id: data._id.toString(),
                        sender: 0,
                        message: message,
                        time: Date.now()
                    },
                    includeSelf
                );
                if (callbackFn !== null) {
                    callbackFn();
                }
            }
        );
    }

    _hookupEvents() {
        var services = this.svcLib.getInstance();
        var thisObj = this;
        this.socket.on(
            eventNames.Disconnect,
            () => {
                services.events.disconnect(thisObj.id);
                thisObj.leaveRoom();
                
                if (thisObj._disconnectFn !== null) {
                    thisObj._disconnectFn();
                }
            }
        );
        this.socket.on(
            eventNames.GetProfileRequest,
            () => {
                services.events.getProfile(thisObj.id);
                thisObj.socket.emit(
                    eventNames.GetProfileResponse,
                    thisObj.profile()
                );
            }
        );

        this.socket.on(
            eventNames.SetDisplayName,
            newName => {
                var oldName = thisObj.username;
                thisObj.username = newName;
                services.events.nameChange(
                    thisObj.id, oldName, newName
                )
                thisObj.emitToRoom(eventNames.DisplayNameChanged, thisObj.profile(), true);
                thisObj.roomSystemMessage(thisObj.currentRoom._id, `"${oldName}" changed their name to "${newName}"`);
            }
        );

        this.socket.on(
            eventNames.GetRoomsRequest,
            () => {
                services.events.getRooms(thisObj.id);
                thisObj.socket.emit(
                    eventNames.GetRoomsResponse,
                    services.rooms.getAll()
                );
            }
        );

        this.socket.on(
            eventNames.RoomChangeRequest,
            (roomId) => thisObj.changeRoom(roomId)
        );

        this.socket.on(
            eventNames.SendMessage,
            message => {
                if (thisObj.currentRoom)
                    services.events.message(
                        thisObj.id, thisObj.username,
                        thisObj.currentRoom._id, message,
                        (err, data) => {
                            thisObj.emitToRoom(
                                eventNames.RoomMessage,
                                {
                                    id: data._id.toString(),
                                    sender: thisObj.id,
                                    message: message,
                                    time: Date.now()
                                },
                                true
                            );
                        }
                    );
            }
        )
    }
}