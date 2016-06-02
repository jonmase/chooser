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
    
    handleSelect: function(e) {
        var url = this.props.sections[parseInt(e.currentTarget.id)].actions[0].url;
        console.log(url);
        window.location.href = url;
    },
    
    render: function() {
        var drawer = '';
        if(this.props.sections) {
            drawer = <Drawer
                docked={false}
                width={250}
                open={this.state.open}
                onRequestChange={(open) => this.setState({open})}
            >
                <h3 style={{padding: '0 16px'}}>Dashboard</h3>
                {this.props.sections.map(function(section, sectionIndex) {
                    return (
                        <MenuItem onTouchTap={this.handleSelect} key={section.title} id={sectionIndex}><FontIcon style={{top: '0.25em', marginRight: '5px'}} className="material-icons">{section.icon}</FontIcon>{section.title}</MenuItem>
                    );
                }, this)}
            </Drawer>;
        }
    
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
                    {drawer}
                </div>
            </MuiThemeProvider>
        );
    }
});



module.exports = TopBar;