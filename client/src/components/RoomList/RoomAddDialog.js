import React, { Component } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Icon,
    InputAdornment,
    TextField,
} from '@material-ui/core';

export class RoomAddDialog extends Component {
    constructor(props) {
        super(props)
        var nameInput = '';
        var iconInput = '';
        if (props.edit) {
            nameInput = props.room.name;
            iconInput = props.room.icon;
        }
        this.state = {
            nameInput: nameInput,
            iconInput: iconInput
        };
        this.onNameChanged = this.onNameChanged.bind(this);
        this.onIconChanged = this.onIconChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancelled = this.onCancelled.bind(this);
    }
    onNameChanged(evt) { this.setState({nameInput: evt.target.value}); }
    onIconChanged(evt) { this.setState({iconInput: evt.target.value}); }
    onSubmit() {
        this.props.onSubmit({
            name: this.state.nameInput,
            icon: this.state.iconInput
        });
    }
    onCancelled() {
        var statestuff = null;
        if (this.props.edit) {
            statestuff = {
                nameInput: this.props.room.name,
                iconInput: this.props.room.icon
            };
        } else {
            statestuff = {
                nameInput: '',
                iconInput: ''
            };
        }
        this.setState(statestuff);
        this.props.onCancelled();
    }
    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.onCancelled}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {
                        this.props.edit ?
                            `Editing ${this.props.room.name}` :
                            "New Room"
                    }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Make your changes and click submit
                    </DialogContentText>
                    <TextField
                        autoFocus
                        id='name'
                        label='Name'
                        type='text'
                        defaultValue={this.state.nameInput}
                        onChange={this.onNameChanged}
                        fullWidth
                    />
                    <TextField
                        id='icon'
                        label='Icon'
                        type='text'
                        defaultValue={this.state.iconInput}
                        onChange={this.onIconChanged}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Icon>
                                        {this.state.iconInput}
                                    </Icon>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button fullWidth onClick={this.onSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}