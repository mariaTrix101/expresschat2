import React from 'react';

import {
    Table, TableCell, TableRow, TableHead, TableBody
} from '@material-ui/core';

export function EventTable(props) {
    console.log(props.events);
    return (
        <Table size='small'>
            {/* {
                props.events.map(e => {
                    return (
                        <TableRow>

                        </TableRow>
                    );
                });
            } */}
            <TableHead>
                <TableRow>
                    <TableCell>Event Type</TableCell>
                    <TableCell>OccuredAt</TableCell>
                    <TableCell>Data</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    props.events.map((e) => {
                        return <TableRow key={e.id}>
                            <TableCell component="th" scope="row">{e.eventType}</TableCell>
                            <TableCell>{e.occurredAt}</TableCell>
                            <TableCell>{e.data}</TableCell>
                         </TableRow>
                    })
                }
            </TableBody>
        </Table>
    );
}