import React from 'react';
import './App.css';

import { PageAppBar }  from './components/AppBar/PageAppBar';
import { PageContent } from './components/PageContent';

import { RoomList } from './components/RoomList/RoomList';
import { ChatLog } from './components/ChatLog/ChatLog';
import { UserList } from './components/UserList/UserList';

import { CssBaseline, Grid, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { PaperBase } from './components/PaperBase';

import io from 'socket.io-client';
import SocketEvents from './socketEvents';
import axios from 'axios';
import { EventTable } from './components/EventTable';

class App extends React.Component {
    static socket;
    constructor() {
        super();
        this.state = {
            profile: {
                id: -1,
                username: '',
                room: -1,
            },
            rooms: [],
            messages: [],
            users: [],
            events: [],
            jwt: '',
            eventDialogOpen: false,
        };
        this.onDisplayNameChanged = this.onDisplayNameChanged.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.onRoomChange = this.onRoomChange.bind(this);
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
        this.onLogout = this.onLogout.bind(this);

        this.onRoomAdded = this.onRoomAdded.bind(this);
        this.onRoomEdited = this.onRoomEdited.bind(this);
        this.onRoomDeleted = this.onRoomDeleted.bind(this);

        this.onOpenEventDialog = this.onOpenEventDialog.bind(this);
        this.onCloseEventDialog = this.onCloseEventDialog.bind(this);
    }

    componentDidMount() {
        App.socket = io("http://localhost:4000/");
        App.socket.on(SocketEvents.Connection, () => {
            console.log('Connected')
            App.socket.on(SocketEvents.GetProfileResponse, (profile) => {
                console.log('Get Profile Response')
                console.log(profile)
                this.setState((state) => {
                    return {
                        ...state,
                        profile: {
                            id: profile.id,
                            username: profile.username,
                            room: profile.room
                        },
                    }
                });
            });
            App.socket.on(SocketEvents.GetRoomsResponse, (rooms) => {
                console.log("Rooms: ");
                console.log(rooms);
                this.setState({
                    rooms: rooms
                });
            });
            App.socket.on(SocketEvents.RoomChangeResponse, (data) => {
                console.log("RoomChange: ");
                console.log(data);
                this.setState((state) => {
                    return {
                        ...state,
                        profile: {
                            id: state.profile.id,
                            username: state.profile.username,
                            room: data.room
                        },
                        users: data.users,
                        messages: []
                    };
                });
            });
            App.socket.on(SocketEvents.UserDisplayNameChanged, (user) => {
                console.log("DisplayNameChanged:");
                console.log(user);
                this.setState((state) => {
                    var newUsers = state.users.map((item) => {
                        if (item.id === user.id)
                            item.username = user.username;
                        return item;
                    });
                    if (user.id === state.profile.id) {
                        return {
                            ...state,
                            profile: {
                                id: user.id,
                                username: user.username,
                                room: user.room
                            },
                            users: newUsers,
                        }
                    }
                    return {
                        ...state,
                        users: newUsers,
                    }
                });
            });
            App.socket.on(SocketEvents.UserJoinedRoom, (user) => {
                console.log("User Joined");
                console.log(user);
                this.setState((state) => {
                    return {
                        ...state,
                        users: state.users.concat(user)
                    }
                });
            })
            App.socket.on(SocketEvents.UserLeftRoom, (user) => {
                console.log("User Left");
                console.log(user);
                this.setState((state) => {
                    return {
                        ...state,
                        users: state.users.filter((item, i) => {
                            return user.id !== item.id;
                        })
                    };
                });
            })
            App.socket.on(SocketEvents.RoomMessage, (msg) => {
                console.log('RoomMessage');
                console.log(msg);
                this.setState((state) => {
                    return {
                        ...state,
                        messages: [
                            ...state.messages,
                            msg
                        ]
                    }
                });
            })
            App.socket.emit(SocketEvents.GetProfileRequest, {});
            App.socket.emit(SocketEvents.GetRoomsRequest, {});
        });
    }

    onOpenEventDialog() {
        axios.get(
            'http://localhost:4000/api/events'
        ).then(e => {
            console.log(e);
            this.setState({
                events: e.data.map(d => {
                    return {
                        id: d._id.toString(),
                        eventType: d.eventType,
                        data: d.data.map((a) => {
                            return Object.keys(a).map(a2 => {
                                return `${a2} = ${a[a2]}`;
                            }).join(', ')
                        }).join(', '),
                        occurredAt: d.occurredAt
                    };
                }),
                eventDialogOpen: true,
            })
        }).catch(e => {
            console.log(e);
        })
    }
    onCloseEventDialog() { this.setState({eventDialogOpen: false}); }

    onLoginSuccess(jwt) {
        axios.defaults.headers.Authorization = `Bearer ${jwt}`;
        this.setState({jwt: jwt});
    }
    onLogout() {
        axios.defaults.headers.Authorization = '';
        this.setState({jwt: ''});
    }

    getAuth() {
        return `Bearer ${this.state.jwt}`;
    }

    onRoomAdded(room) {
        axios.post(
            'http://localhost:4000/api/rooms',
            room,
        ).then(e => {
            console.log(e);
        }).catch(e => {
            console.log(e);
        })
    }
    onRoomEdited(room) {
        console.log(room);
        axios.put(
            'http://localhost:4000/api/rooms',
            {
                id: room._id,
                room: {
                    name: room.name,
                    icon: room.icon
                }
            },
        ).then(e => {
            console.log(e);
        }).catch(e => {
            console.log(e);
        })
    }
    onRoomDeleted(room) {
        axios.delete(
            `http://localhost:4000/api/rooms/${room}`,
            {
                id: room,
            },
        ).then(e => {
            console.log(e);
        }).catch(e => {
            console.log(e);
        })
        console.log(room);
    }

    onDisplayNameChanged(newName) {
        App.socket.emit(SocketEvents.SetDisplayName, newName);
    }

    onSendMessage(newMessage) {
        App.socket.emit(SocketEvents.SendMessage, newMessage);
    }

    onRoomChange(roomId) {
        console.log('Requesting change to room: %s', roomId);
        App.socket.emit(SocketEvents.RoomChangeRequest, roomId);
    }

    render() {
        return (
            <div className='App'>
                <CssBaseline />
                <Grid container direction="column" justify="flex-start" alignItems="stretch" wrap="nowrap" style={{'height': '100%'}}>
                    <PageAppBar
                        username={this.state.profile.username}
                        onDisplayNameChanged={this.onDisplayNameChanged}
                        loginSuccess={this.onLoginSuccess}
                        onLogout={this.onLogout}
                        onOpenEventDialog={this.onOpenEventDialog}
                        onCloseEventDialog={this.onCloseEventDialog}
                        loggedIn={this.state.jwt !== ''}
                    />
                    <Dialog
                        fullScreen
                        open={this.state.eventDialogOpen}
                        onClose={this.onCloseEventDialog}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">
                            Events
                        </DialogTitle>
                        <DialogContent>
                            <EventTable
                                events={this.state.events}
                            />
                        </DialogContent>
                    </Dialog>
                    <PageContent>
                        {/* These items are a part of a nested <Grid container...> in PageContent */}
                        <PaperBase size={3}>
                            <RoomList
                                rooms={this.state.rooms}
                                currentRoom={this.state.profile.room}
                                onRoomChange={this.onRoomChange}
                                onRoomAdded={this.onRoomAdded}
                                onRoomEdit={this.onRoomEdited}
                                onRoomDelete={this.onRoomDeleted}
                                loggedIn={this.state.jwt !== ''}
                            />
                        </PaperBase>
                        <PaperBase size={6}>
                            <ChatLog messages={this.state.messages} profile={this.state.profile} users={this.state.users} onSendMessage={this.onSendMessage} />
                        </PaperBase>
                        <PaperBase size={3}>
                            <UserList users={this.state.users} />
                        </PaperBase>
                    </PageContent>
                </Grid>
            </div>
        );
    }
}

export default App;
