import React from 'react';

import {
    Grid,
    Typography,
    List,
} from '@material-ui/core';

import { UserListItem } from './UserListItem';

export class UserList extends React.Component {
    render() {
        return (
            <Grid container direction="column" justify="flex-start" alignItems="stretch">
                <Grid item>
                    <Typography align="center" variant="h4">
                        User List
                    </Typography>
                </Grid>
                <Grid item>
                    <List>
                    {this.props.users.map((user) => (
                        <UserListItem key={user.id} name={user.username} />
                    ))}
                    </List>
                </Grid>
            </Grid>
        )
    }
}
