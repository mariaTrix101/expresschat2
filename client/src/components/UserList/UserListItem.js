import React, { Component } from 'react';

import { ListItem, ListItemText } from '@material-ui/core';

export class UserListItem extends Component {

    render() {
        const { name } = this.props;

        return (
            <ListItem button>
                <ListItemText primary={name} />
            </ListItem>
        );
    }
}