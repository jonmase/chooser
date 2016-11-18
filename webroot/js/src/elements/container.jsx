import React from 'react';

import ChooserTheme from './theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function Container(props) {
    return (
        <MuiThemeProvider muiTheme={ChooserTheme}>
            <div>
                <div style={{margin: '0 -2rem'}}>
                    {props.topbar}
                </div>
                <div style={{paddingTop: '64px'}}>
                    {props.children}
                </div>
            </div>
        </MuiThemeProvider>
    );
}

module.exports = Container;