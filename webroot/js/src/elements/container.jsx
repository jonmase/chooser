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
                    {(props.tabs && props.tabs.length > 0) &&
                        <div style={{paddingTop: '64px'}}>
                            <Tabs>
                                {props.tabs.map(function(tab, index) {
                                    return (
                                        <Tab label={tab.label} key={"tab_" + index}>
                                            {tab.content}
                                        </Tab>
                                    );
                                })}
                            </Tabs>
                        </div>
                    }
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