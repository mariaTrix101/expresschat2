import React, { Component } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from '@material-ui/core';

export class ChangeDisplayNameButton extends Component {
    constructor() {
        super();
        this.state = {
            dialogOpen: false,
            inputText: ''
        };

        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
    }

    handleOpenDialog() { this.setState({dialogOpen: true}); }
    handleCloseDialog() { this.setState({dialogOpen: false}); }

    handleChangeName() {
        this.handleCloseDialog();
        this.props.onChangeName(this.state.inputText)
    }
    onTextChanged(evt) { this.setState({inputText: evt.target.value}); }

    render() {
        const dialogText = (
            <DialogContentText>
                Type in your new display name below and click 'Okay'
            </DialogContentText>
        );
        const textField = <TextField
            autoFocus
            id="name"
            label="Display Name"
            type="text"
            defaultValue={this.props.username}
            onChange={this.onTextChanged}
            fullWidth
        />

        const cancelButton = (
            <Button onClick={this.handleCloseDialog} color="primary">
                Cancel
            </Button>
        );
        const okayButton = (
            <Button onClick={this.handleChangeName} color="primary">
                Okay
            </Button>
        );

        return (
            <div>
                <Button color="inherit" onClick={this.handleOpenDialog}>
                    Change Display Name&nbsp;<Typography style={{'fontWeight': 700}} >({this.props.username})</Typography>
                </Button>
                <Dialog 
                    open={this.state.dialogOpen}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change Display Name</DialogTitle>
                    <DialogContent>
                        {dialogText}
                        {textField}
                    </DialogContent>
                    <DialogActions>
                        {cancelButton}
                        {okayButton}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
} 