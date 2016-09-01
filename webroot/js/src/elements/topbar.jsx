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
    
    handleDashboardSelect: function(e) {
        var url = this.props.dashboardUrl;
        console.log(url);
        window.location.href = url;
    },
    
    handleSelect: function(e) {
        var sectionIndex = parseInt(e.currentTarget.dataset.sectionIndex);
        var actionIndex = parseInt(e.currentTarget.dataset.actionIndex);
    
        var url = this.props.sections[sectionIndex].actions[actionIndex].url;
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
                <MenuItem onTouchTap={this.handleDashboardSelect} key="dashboard" id="dashboard"><h3 style={{margin: '10px 0 0'}}>Dashboard</h3></MenuItem>
                {this.props.sections.map(function(section, sectionIndex) {
                    return section.actions.map(function(action, actionIndex) {
                        var id = sectionIndex + "-" + actionIndex;
                        if(action.icon) {
                            var icon = action.icon;
                        }
                        else {
                            var icon = section.icon;
                        }
                        if(action.menuLabel) {
                            var label = action.menuLabel;
                        }
                        else {
                            var label = section.title;
                        }
                        
                        
                        return (
                            <MenuItem onTouchTap={this.handleSelect} key={id} id={id} data-section-index={sectionIndex} data-action-index={actionIndex}><FontIcon style={{top: '0.25em', marginRight: '5px'}} className="material-icons">{icon}</FontIcon>{label}</MenuItem>
                        );
                    }, this);
                    /*else {
                        return (
                            <MenuItem onTouchTap={this.handleSelect} key={section.title} id={sectionIndex}><FontIcon style={{top: '0.25em', marginRight: '5px'}} className="material-icons">{section.icon}</FontIcon>{label}</MenuItem>
                        );
                    }*/
                }, this)}
            </Drawer>;
        }
    
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <AppBar
                        title={<span>Chooser<span style={styles.subtitle}>{this.props.choice.name}</span></span>}
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