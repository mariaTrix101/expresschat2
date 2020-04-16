import './ChatLog.css';
import React, { Component } from 'react';
import { List } from '@material-ui/core';
import { SendMessageBox } from './SendMessageBox';
import { ChatLogMessage } from './ChatLogMessage';

export class ChatLog extends Component {

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }
    render() {
        return (
            <div className='ChatRoomContainer'>
                <div className='ChatLog' style={{height: '100%', overflowY: 'auto'}}>
                    <List style={{'height': '100%'}}>
                        {this.props.messages.map(msg =>
                            <ChatLogMessage key={msg.id} profile={this.props.profile} users={this.props.users} msg={msg} />
                        )}
                    </List>
                    {/* https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react */}
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
                <SendMessageBox onSendMessage={this.props.onSendMessage} />
            </div>
        );
    }
}