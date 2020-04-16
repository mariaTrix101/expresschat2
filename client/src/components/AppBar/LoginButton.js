import React, { Component } from 'react';
import axios from 'axios';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@material-ui/core';

export class LoginButton extends Component {
    constructor() {
        super();
        this.state = {
            dialogOpen: false,
            inputUsername: 'admin',
            inputPassword: 'admin',
        };

        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onUsernameChanged = this.onUsernameChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
    }

    handleOpenDialog() {
        if (this.props.login)
            this.setState({dialogOpen: true});
        else
            this.props.onLogout();
    }
    handleCloseDialog() {
        this.setState({dialogOpen: false});
    }
    handleSubmit() {
        this.handleCloseDialog();
        axios.post(
            'http://localhost:4000/api/login',
            {
                username: this.state.inputUsername,
                password: this.state.inputPassword
            }
        ).then(e => {
            console.log(e);
            this.props.loginSuccess(e.data.token);
        }).catch(err => {
            console.log(err.data);
            this.handleOpenDialog();
        });
    }
    onUsernameChanged(evt) {
        this.setState({inputUsername: evt.target.value});
    }
    onPasswordChanged(evt) {
        this.setState({inputPassword: evt.target.value});
    }

    render() {
        const dialogText = (
            <DialogContentText>
                Type in the username and password
            </DialogContentText>
        );

        const usernameField = (
            <TextField
                autoFocus
                id='username'
                label='Username'
                type="text"
                defaultValue={this.state.inputUsername}
                onChange={this.onUsernameChanged}
                fullWidth
            />
        );

        const passwordField = (
            <TextField
                autoFocus
                id='password'
                label='Password'
                type="password"
                defaultValue={this.state.inputPassword}
                onChange={this.onPasswordChanged}
                fullWidth
            />
        );

        const cancelButton = (
            <Button onClick={this.handleCloseDialog} color="primary">
                Cancel
            </Button>
        );
        const label = this.props.login ? "Login" : "Logout";
        const loginButton = (
            <Button onClick={this.handleSubmit} color="primary">
                {label}
            </Button>
        );

        return (
            <div>
                <Button color="inherit" onClick={this.handleOpenDialog}>
                    {label}
                </Button>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="form-dialog-title">

                    <DialogTitle id="form-dialog-title">
                        Administrators
                    </DialogTitle>
                    <DialogContent>
                        {dialogText}
                        {usernameField}
                        {passwordField}
                    </DialogContent>
                    <DialogActions>
                        {cancelButton}
                        {loginButton}
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
