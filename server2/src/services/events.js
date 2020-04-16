const database = require('../database');
const events = require('../models/event');

module.exports = class EventLogger {
    addEvent(eventType, data, callbackFn) {
        events.create({
            eventType: eventType,
            data: data
        }, (err, data) => {
            database.handle_result(err, data, callbackFn);
        });
    }

    error(type, msg, callbackFn) {
        this.addEvent('ERROR_' + type, {msg: msg}, callbackFn);
    }

    connection(ip, callbackFn) {
        this.addEvent('CONNECTION', {ip: ip}, callbackFn);
    }
    disconnect(connId, callbackFn) {
        this.addEvent('DISCONNECT', {connId: connId}, callbackFn);
    }
    getProfile(connId, callbackFn) {
        this.addEvent('GET_PROFILE', {connId: connId}, callbackFn);
    }
    getRooms(connId, callbackFn) {
        this.addEvent('GET_ROOMS', {connId: connId}, callbackFn);
    }
    message(connId, sender, roomId, message, callbackFn) {
        this.addEvent('MESSAGE', {
            connId: connId,
            username: sender,
            room: roomId,
            message: message
        }, callbackFn);
    }
    roomChange(connId, user, toRoomId, callbackFn) {
        this.addEvent('ROOM_CHANGE', {
            connId: connId,
            user: user,
            newRoom: toRoomId
        }, callbackFn);
    }
    nameChange(connId, from, to, callbackFn) {
        this.addEvent('NAME_CHANGE', {
            connId: connId,
            from: from,
            to: to
        }, (err, data) => {
            database.handle_result(err, data, callbackFn);
        });
    }
    register(username, callbackFn) {
        this.addEvent('REGISTER', {
            username: username
        }, (err, data) => {
            database.handle_result(err, data, callbackFn);
        })
    }
    login(username, callbackFn) {
        this.addEvent('LOGIN', {
            username: username
        }, (err, data) => {
            database.handle_result(err, data, callbackFn);
        });
    }
}
