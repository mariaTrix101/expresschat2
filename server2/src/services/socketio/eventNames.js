
module.exports = {
    Connection: 'connection',
    Disconnect: 'disconnect',

    /* Client -> Server */ GetProfileRequest: 'get_profile',
    /* Server -> Client */ GetProfileResponse: 'get_profile_response', // displayName, currentRoom

    /* Client -> Server */ SetDisplayName: 'set_displayname',
    /* Server -> Client */ DisplayNameChanged: 'user_displayname_changed',

    /* Client -> Server */ GetRoomsRequest: 'get_rooms', // get all rooms
    /* Server -> Client */ GetRoomsResponse: 'get_rooms_response',

    /* Client -> Server */ RoomChangeRequest: 'room_change',
    /* Server -> Client */ RoomChangeResponse: 'room_change_response', // Room user list

    /* Client -> Server */ SendMessage: 'send_message', // Send a message to your room
    /* Server -> Client */ RoomMessage: 'room_message', // A message was sent in your room

    /* Server -> Client */ UserJoinedRoom: 'user_joined', // New user joined your room
    /* Server -> Client */ UserLeftRoom: 'user_left', // A User left your room
};