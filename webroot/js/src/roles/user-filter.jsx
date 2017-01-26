import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

var UserFilters = React.createClass({
    nameBase: "filterRoles",
    
    render: function() {
        var menuItems = this.props.roles.map(function(role) {
            return (
                <MenuItem
                    value={role.id}
                    primaryText={role.id.charAt(0).toUpperCase() + role.id.substr(1,role.length)}
                    key={role.id}
                />
            );
        });
        
        return (
            <IconMenu
                iconButtonElement={<IconButton iconClassName="material-icons" tooltip="Filter by Role">filter_list</IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                multiple={true}
                value={this.props.state.filterRoles}
                onChange={this.props.handlers.change}
            >
                {menuItems}
            </IconMenu>            
        );
    }
});

module.exports = UserFilters;