const express = require('express');
const eventLogs = require('../../../models/event');


function success(res, data) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200)
       .json(data);
}

function basic_db_response(res, err, data) {
    if (err) {
        console.log(err);
        res.status(500)
           .end('Application experienced unknown error');
    } else {
        success(res, data);
    }
}


module.exports = () => {
    const router = express.Router();

    router.get(
        '/api/events',
        (req, res) => {
            eventLogs.find(
                { },
                (err, data) => basic_db_response(res, err, data)
            );
        }
    );

    router.get(
        '/api/messages',
        (req, res) => {
            // If 'room' param exists, filter by that as well?
            var query = null;
            if (req.body.roomId !== null) {
                query = {
                    data: {
                        $elemMatch: {
                            room: req.body.roomId
                        }
                    }
                }
            }
            query['eventType'] = 'MESSAGE';
            eventLogs.find(
                query,
                (err, data) => basic_db_response(res, err, data)
            );
        }
    );


    return router;
};