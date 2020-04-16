const express = require('express');
const rooms = require('../../../models/room');

function db_result(err, data, res) {
    if (err) {
        res.status(500).json({
            error: true,
            info: { message: "Try again later" }
        })
    }
    else {
        res.status(200).json(data);
    }
}

module.exports = (svcLib) => {
    const router = express.Router();
    const services = svcLib.getInstance();

    router.get('/api/rooms', (req, res) => {
        rooms.find(
            {},
            (err, data) => {
                db_result(err, data, res);
            }
        )
    });

    function isUndefinedOrEmpty(val) {
        return val === undefined || val.length === 0;
    }
    function missingParameters(res) {
        res.status(400).json({error: true, info: { message: "Missing Parameters" }});
    }

    router.post('/api/rooms', (req, res) => {
        var body = req.body;
        if (isUndefinedOrEmpty(body.name)) {
            missingParameters(res);
            return;
        }
        services.rooms.create(
            body.name, body.icon || 'chat',
            (err, data) => {
                db_result(err, data, res);
            }
        );
    });

    router.put('/api/rooms', (req, res) => {
        var body = req.body;
        if (isUndefinedOrEmpty(body.id)
            || isUndefinedOrEmpty(body.room.name)
            || isUndefinedOrEmpty(body.room.icon)) {
            missingParameters(res);
            return;
        }
        services.rooms.update(
            body.id, body.room, (err, data) => {
                db_result(err, data, res);
            }
        );
    });

    router.delete('/api/rooms/:id', (req, res) => {
        if (isUndefinedOrEmpty(req.params.id)) {
            missingParameters(res);
            return;
        }
        services.rooms.delete(req.params.id, (err, data) => {
            if (!err) {
                res.status(200).json({success: true});
                return;
            }
            db_result(err, data, res);
        })
    });

    return router;
};