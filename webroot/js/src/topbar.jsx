var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconButton = require('material-ui/lib/icon-button');
var FontIcon = require('material-ui/lib/font-icon');

const styles = {
  subtitle: {
    'fontSize': '80%',
    'marginLeft': '10px',
  },
};

const TopBar = () => (
    <AppBar
        title={<span>Chooser<span style={styles.subtitle}>Name of Choice/Choosing Instance</span></span>}
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
);

module.exports = TopBar;