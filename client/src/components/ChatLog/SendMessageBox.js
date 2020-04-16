import React, { Component } from 'react';

import { InputAdornment, IconButton, TextField } from '@material-ui/core';
import { Send } from '@material-ui/icons';

export class SendMessageBox extends Component {
    constructor () {
        super();
        this.state = {
            text: ''
        };

        this.sendMessage = this.sendMessage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleTextChanged = this.handleTextChanged.bind(this);
    }

    sendMessage() {
        if (this.state.text.trim().length === 0) return;
        this.props.onSendMessage(this.state.text);
        this.setState({text: ''});
    }


    handleKeyPress(event) {
        const EnterKey = 13;
        if (event.charCode !== EnterKey) return;
        this.sendMessage();
    }

    handleTextChanged(event) {
        this.setState({text: event.target.value});
    }

    render() {
        return (
            <div>
                <TextField
                    fullWidth
                    style={{padding: 12}}
                    type='text'
                    onKeyPress={this.handleKeyPress}
                    onChange={this.handleTextChanged}
                    value={this.state.text}
                    variant='outlined'
                    /* https://material-ui.com/components/text-fields/#input-adornments */
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={this.sendMessage}>
                                    <Send />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </div>
            
        );
    }
}