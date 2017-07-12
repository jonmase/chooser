import React from 'react';

import AppBar from 'material-ui/AppBar';

import DashboardMenu from './dashboard-menu.jsx';

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
            </div>
        );
    }
});



module.exports = TopBar;