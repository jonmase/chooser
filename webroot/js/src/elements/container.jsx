import React from 'react';

import ChooserTheme from './theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function Container(props) {
    return (
        <MuiThemeProvider muiTheme={ChooserTheme}>
            <div>
                <nav id="topbar" style={{margin: '0 -2rem'}}>
                    {props.topbar}
                </nav>

                <div style={{paddingTop: '64px'}}>
                    <h2 className="page-title">{props.title}</h2>
                    {props.children}
                </div>
            </div>
        </MuiThemeProvider>
    );
}

module.exports = Container;