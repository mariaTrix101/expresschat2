import React from 'react';

import { Grid, Paper } from '@material-ui/core';

export function PaperBase(props) {
    return (
        <Grid item sm={props.size} md={props.size} lg={props.size} className='FullHeight'>
            <Paper elevation={3} style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'auto'
            }}>
                {props.children}
            </Paper>
        </Grid>
    );
}