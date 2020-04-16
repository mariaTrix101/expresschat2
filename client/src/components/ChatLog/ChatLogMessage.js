import React from 'react';

import { ListItem, Typography } from '@material-ui/core';

export function ChatLogMessage(props) {
    var user = null;
    if (props.profile.id === props.msg.sender)
        user = props.profile;
    else if (props.msg.sender === 0) {
        // if sender id === 0, the message is considered a system message
        user = {
            username: '[System]'
        }
    } else
        user = props.users.filter(e => e.id === props.msg.sender)[0];
    console.log(props);
    return (
        <ListItem key={props.msg.id}>
            <Typography style={{fontWeight: 700}}>
                {user.username}:&nbsp;
            </Typography>
            <Typography>
                {props.msg.message}
            </Typography>
        </ListItem>
    );
}