import React, { Component } from 'react';

import {
    Grid,
    List,
    Typography,
    Icon,
    Tooltip,
    Button
} from '@material-ui/core';
import { RoomListItem } from './RoomListItem';
import { RoomAddDialog } from './RoomAddDialog';


export class RoomList extends Component {
    constructor() {
        super();
        this.state = {
            newDialogOpen: false
        };

        this.onCancel = this.onCancel.bind(this);
        this.onRoomAdd = this.onRoomAdd.bind(this);
        this.onShowRoomAdd = this.onShowRoomAdd.bind(this);
    }
    onShowRoomAdd() {
        this.setState({
            newDialogOpen: true
        });
    }
    onCancel() {
        this.setState({
            newDialogOpen: false
        });
    }
    onRoomAdd(room) {
        this.onCancel();
        this.props.onRoomAdded(room);
    }
    render() {
        const roomElements = this.props.rooms.map(
            room => (
            <RoomListItem
                key={room._id}
                room={room}
                current={this.props.currentRoom === room._id}
                onSelected={this.props.onRoomChange}
                showControls={this.props.loggedIn}
                onRoomEdit={this.props.onRoomEdit}
                onRoomDelete={this.props.onRoomDelete}
            />
        ));
        return (
            <Grid container direction="column" justify="flex-start" alignItems="stretch" wrap="nowrap">
                <Grid item>
                    <Typography align="center" variant="h4">
                        Room List
                        <RoomAddDialog
                            open={this.state.newDialogOpen}
                            edit={false}
                            onSubmit={this.onRoomAdd}
                            onCancelled={this.onCancel}
                        />
                    </Typography>
                    {
                        this.props.loggedIn ?
                        <Tooltip title="Create room">
                            <Button color="primary" fullWidth onClick={this.onShowRoomAdd}>
                                <Icon>add</Icon>
                                New Room
                            </Button>
                        </Tooltip> :
                        null
                    }
                </Grid>
                <Grid item className='FullHeight'>

                    <List>
                        {roomElements}
                    </List>
                </Grid>
            </Grid>
        );
    }
}
