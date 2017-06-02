import React from 'react';

import Paper from 'material-ui/Paper';
import {indigo500} from 'material-ui/styles/colors';

import WarningIcon from '../elements/icons/warning.jsx';

function Alert(props) {
    return (
        <Paper style={{marginBottom: '20px', padding: '15px'}} zDepth={2} rounded={false}>
            <p style={{color: indigo500, lineHeight: '36px', margin: 0}}><WarningIcon colour="indigo" large={true} /> {props.children}</p>
        </Paper>
    );
}

module.exports = Alert;