import React, { Component } from 'react';

import {
    Icon,
    ListItem,
    ListItemText,
    Typography,
    IconButton,
    ListItemAvatar,
    Avatar,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogContent,
    DialogActions,
    Button
} from '@material-ui/core';
import { RoomAddDialog } from './RoomAddDialog';

export class RoomListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editDialogOpen: false,
            deleteDialogOpen: false,
        };
        this.onJoinClicked = this.onJoinClicked.bind(this);

        this.openEditDialog = this.openEditDialog.bind(this);
        this.closeEditDialog = this.closeEditDialog.bind(this);
        this.onSubmitEdit = this.onSubmitEdit.bind(this);

        this.openDeleteDialog = this.openDeleteDialog.bind(this);
        this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
    }

    openEditDialog() { this.setState({editDialogOpen: true}); }
    closeEditDialog() { this.setState({editDialogOpen: false}); }

    openDeleteDialog() { this.setState({deleteDialogOpen: true}); }
    closeDeleteDialog() { this.setState({deleteDialogOpen: false}); }

    onJoinClicked() {
        if (this.props.current) return;
        this.props.onSelected(this.props.room._id);
    }

    onSubmitEdit(room) {
        this.closeEditDialog();
        console.log(this.state);
        this.props.onRoomEdit(
            {
                ...this.props.room,
                ...room
            }
        );
    }
    onDeleteItem() {
        this.closeDeleteDialog();
        this.props.onRoomDelete(
            this.props.room._id
        );
    }

    render() {
        var nameProps = {};
        var controls = null;

        if (this.props.showControls) {
            controls = (
                <div>
                    <Tooltip title="Join room">
                        <IconButton 
                                color="primary"
                                component="span"
                                onClick={this.onJoinClicked}>
                            <Icon>arrow_forward</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit room">
                        <IconButton
                            color="primary"
                            component="span"
                            onClick={this.openEditDialog}>
                            <Icon>create</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete room">
                        <IconButton
                            color="primary"
                            component="span"
                            onClick={this.openDeleteDialog}>
                            <Icon>delete</Icon>
                        </IconButton>
                    </Tooltip>
                </div>
            );
        }

        const editDialog = (
            <RoomAddDialog
                edit={true}
                open={this.state.editDialogOpen}
                room={this.props.room}
                onSubmit={this.onSubmitEdit}
                onCancelled={this.closeEditDialog}
            />
        );

        const deleteDialog = (
            <Dialog
                open={this.state.deleteDialogOpen}
                onClose={this.closeDeleteDialog}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the room '{this.props.room.name}'?
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onDeleteItem} color="secondary">
                        Yes
                    </Button>
                    <Button onClick={this.closeDeleteDialog} color="primary">
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        );

        if (this.props.current)
            nameProps['fontWeight'] = 700;
        return (
            <ListItem
                button={!this.props.showControls}
                onClick={this.props.showControls ? null : this.onJoinClicked}
            >
                {editDialog}
                {deleteDialog}
                <ListItemAvatar>
                    <Avatar>
                        <Icon>{this.props.room.icon}</Icon>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText>
                    <Typography style={nameProps}>
                        {this.props.room.name}
                    </Typography>
                    {controls}
                </ListItemText>
            </ListItem>
        );
    }
}