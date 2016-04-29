import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

var UserSort = React.createClass({
    nameBase: "filterRoles",
    
    render: function() {
        return (
            <IconMenu
                iconButtonElement={<IconButton iconClassName="material-icons" tooltip="Sort Order">sort</IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                value={this.props.state.sortUsersField}
                onChange={this.props.handlers.change}
            >
                <MenuItem value={'username'} primaryText="Username" />
                <MenuItem value={'firstname'} primaryText="First Name" />
                <MenuItem value={'lastname'} primaryText="Last Name" />
            </IconMenu>            
        );
    }
});

module.exports = UserSort;