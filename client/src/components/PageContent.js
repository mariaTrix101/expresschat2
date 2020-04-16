import React, { Component } from 'react';

import { Grid } from '@material-ui/core';

export class PageContent extends Component {

    render() {
        const style = {
            'height': '100%',
            'paddingTop': '1%',
            'paddingLeft': '1%',
            'paddingRight': '1%',
        };

        return (
            <Grid item className={'PageContent'} style={{'overflowX': 'hidden', 'flexGrow': '1'}}>
                <Grid container direction='row' alignItems="stretch" style={style} spacing={3}>
                    {this.props.children}
                </Grid>
            </Grid>
        );
    }
}
