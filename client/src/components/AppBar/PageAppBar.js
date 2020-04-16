import React, { Component } from 'react';

import {
    AppBar,
    Button,
    Grid,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { ChangeDisplayNameButton } from './ChangeDisplayNameButton';
import { LoginButton } from './LoginButton';

export class PageAppBar extends Component {
    render() {
        return (
            <Grid item>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{'flexGrow': '1'}}>
                            Express Chat
                        </Typography>
                        {
                            this.props.loggedIn ?
                                <Button
                                    onClick={this.props.onOpenEventDialog}
                                >
                                    Event List
                                </Button> :
                                null
                        }
                        <LoginButton
                            login={!this.props.loggedIn}
                            loginSuccess={this.props.loginSuccess}
                            onLogout={this.props.onLogout}
                        />
                        <ChangeDisplayNameButton username={this.props.username} onChangeName={this.props.onDisplayNameChanged} />
                    </Toolbar>
                </AppBar>
            </Grid>
        );
    }
}