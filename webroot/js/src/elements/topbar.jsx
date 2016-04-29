import React from 'react';

import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ChooserTheme from '../theme.jsx';

var styles = {
  subtitle: {
    'fontSize': '80%',
    'marginLeft': '10px',
  },
};

var TopBar = React.createClass({
    render: function() {
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <AppBar
                    title={<span>Chooser<span style={styles.subtitle}>{this.props.subtitle}</span></span>}
                    showMenuIconButton={false}
                    iconElementLeft={<IconButton><FontIcon className="material-icons">menu</FontIcon></IconButton>}
                    iconElementRight={
                        <IconMenu
                            iconButtonElement={ <IconButton><FontIcon className="material-icons">more_vert</FontIcon></IconButton> }
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        >
                            <MenuItem primaryText="Refresh" />
                            <MenuItem primaryText="Help" />
                            <MenuItem primaryText="Sign out" />
                        </IconMenu>
                    }
                />
            </MuiThemeProvider>
        );
    }
});



module.exports = TopBar;