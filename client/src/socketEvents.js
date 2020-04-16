export default {
    Connection: 'connect',
    Disconnect: 'disconnect',

    /* Client -> Server */ GetProfileRequest: 'get_profile',
    /* Server -> Client */ GetProfileResponse: 'get_profile_response', // username, room

    /* Client -> Server */ SetDisplayName: 'set_displayname',
    /* Server -> Client */ UserDisplayNameChanged: 'user_displayname_changed',

    /* Client -> Server */ GetRoomsRequest: 'get_rooms', // get all rooms
    /* Server -> Client */ GetRoomsResponse: 'get_rooms_response',

    /* Client -> Server */ RoomChangeRequest: 'room_change',
    /* Server -> Client */ RoomChangeResponse: 'room_change_response', // includes user list, room name, room id

    /* Client -> Server */ SendMessage: 'send_message', // Send a message to your room
    /* Server -> Client */ RoomMessage: 'room_message', // A message was sent in your room

    /* Server -> Client */ UserJoinedRoom: 'user_joined', // New user joined your room
    /* Server -> Client */ UserLeftRoom: 'user_left', // A User left your room
};