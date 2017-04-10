import React from 'react';

import ChooserTheme from './theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';

function Container(props) {
    var topbar = props.topbar;

    return (
        <MuiThemeProvider muiTheme={ChooserTheme}>
            <div>
                <nav id="topbar" style={{margin: '0 -2rem'}}>
                    {props.topbar}
                    {(props.tabs && props.tabs.tabs.length > 0) &&
                        <div style={{paddingTop: '64px'}}>
                            <Tabs value={props.tabs.value} onChange={props.tabs.onChange} >
                                {props.tabs.tabs.map(function(tab) {
                                    return (
                                        <Tab key={tab.value} label={tab.label} value={tab.value}>
                                            {tab.content}
                                        </Tab>
                                    );
                                })}
                            </Tabs>
                        </div>
                    }
                </nav>
                <div style={{paddingTop: '96px'}}>
                    {props.children}
                </div>
            </div>
        </MuiThemeProvider>
    );
}

module.exports = Container;