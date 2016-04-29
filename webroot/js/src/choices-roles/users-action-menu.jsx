import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

var UsersRole = React.createClass({
    render: function() {
        return (
            <IconMenu
                iconButtonElement={<IconButton iconClassName="material-icons" tooltip="More Actions">more_vert</IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem primaryText="Refresh" />
                <MenuItem primaryText="Send feedback" />
                <MenuItem primaryText="Settings" />
                <MenuItem primaryText="Help" />
                <MenuItem primaryText="Sign out" />
            </IconMenu>            
        );
    }
});

module.exports = UsersRole;