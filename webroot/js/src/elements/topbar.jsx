import React from 'react';

import AppBar from 'material-ui/AppBar';
//import {Tabs, Tab} from 'material-ui/Tabs';

import DashboardMenu from './dashboard-menu.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ChooserTheme from './theme.jsx';

var TopBar = React.createClass({
    getInitialState: function () {
        return {
            menuDrawerOpen: false,
        };
    },
    
    handleMenuDrawerToggle: function() {
        this.setState({menuDrawerOpen: !this.state.menuDrawerOpen});
    },
    
    handleMenuDrawerRequestChange: function(open) {
        this.setState({menuDrawerOpen: open});
    },
    
    render: function() {
        var showLeftIcon = true;
        var showMenu = false;
        if(this.props.iconLeft === 'menu') {
            showMenu = true;
        }
        else if(this.props.iconLeft === null) {
            showLeftIcon = false;
        }
        
        return (
            <div>
                <AppBar
                    title={this.props.title}
                    showMenuIconButton={showLeftIcon}
                    onLeftIconButtonTouchTap={showMenu?this.handleMenuDrawerToggle:function() {return false; }}
                    iconElementLeft={(showMenu)?null:this.props.iconLeft}
                    iconElementRight={this.props.iconRight}
                    style={{position: 'fixed'}}
                    zDepth={(typeof(this.props.zDepth) !== "undefined")?this.props.zDepth:2}
                />
                {showMenu && 
                    <DashboardMenu
                        dashboardUrl={this.props.dashboardUrl} 
                        handlers={{
                            requestChange: this.handleMenuDrawerRequestChange,
                            toggle: this.handleMenuDrawerToggle,
                        }}
                        open={this.state.menuDrawerOpen}
                        sections={this.props.sections}
                    />
                }
                {/*this.props.showStepTabs &&
                    <div style={{position: 'fixed', paddingTop: '64px', width: '100%'}}>
                        <Tabs> 
                            <Tab label="Item One" >
                                <div>
                                    <h2>Tab One</h2>
                                    <p>
                                        This is an example tab.
                                    </p>
                                    <p>
                                        You can put any sort of HTML or react component in here. It even keeps the component state!
                                    </p>
                                </div>
                            </Tab>
                            <Tab label="Item Two" >
                                <div>
                                    <h2>Tab Two</h2>
                                    <p>
                                        This is another example tab.
                                    </p>
                                </div>
                            </Tab>
                            <Tab label="onActive" disabled={true}>
                                <div>
                                    <h2>Tab Three</h2>
                                    <p>
                                        This is a third example tab.
                                    </p>
                                </div>
                            </Tab>
                        </Tabs>                    
                    </div>
                */}
            </div>
        );
    }
});



module.exports = TopBar;