import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ChooserTheme from '../theme.jsx';

var styles = {
  subtitle: {
    'fontSize': '80%',
    'marginLeft': '10px',
  },
};

var TopBar = React.createClass({
    getInitialState: function () {
        return {
            open: false,
        };
    },
    
    handleToggle: function() {
        this.setState({open: !this.state.open});
    },
    
    handleClose: function() {
        this.setState({open: false});
    },
    
    render: function() {
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <AppBar
                        title={<span>Chooser<span style={styles.subtitle}>{this.props.subtitle}</span></span>}
                        showMenuIconButton={this.props.menu?true:false}
                        onLeftIconButtonTouchTap={this.handleToggle}
                        //iconElementLeft={<IconButton><FontIcon className="material-icons">menu</FontIcon></IconButton>}
                        iconElementRight={<span></span>}
                        /*iconElementRight={
                            <IconMenu
                                iconButtonElement={ <IconButton><FontIcon className="material-icons">more_vert</FontIcon></IconButton> }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            >
                                <MenuItem primaryText="Refresh" />
                                <MenuItem primaryText="Help" />
                                <MenuItem primaryText="Sign out" />
                            </IconMenu>
                        }*/
                    />
                    <Drawer
                        docked={false}
                        width={200}
                        open={this.state.open}
                        onRequestChange={(open) => this.setState({open})}
                    >
                        <h3 style={{padding: '0 16px'}}>Dashboard</h3>
                        <MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
                        <MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>
                    </Drawer>
                </div>
            </MuiThemeProvider>
        );
    }
});



module.exports = TopBar;