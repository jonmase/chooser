import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

var UserFilters = React.createClass({
    render: function() {
        var menuItems = this.props.roles.map(function(role) {
            return (
                <MenuItem
                    value={role.id}
                    primaryText={role.id.charAt(0).toUpperCase() + role.id.substr(1,role.length) + "s"}
                    key={role.id}
                />
            );
        });
        
        menuItems.push(<Divider key="divider" />);
        menuItems.push(<MenuItem
                    value="clear"
                    primaryText="Clear"
                    key="clear"
                />);
        
        return (
            <IconMenu
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                iconButtonElement={<IconButton iconClassName="material-icons" tooltip="Filter by Role">filter_list</IconButton>}
                iconStyle={this.props.iconStyle}
                multiple={true}
                onChange={this.props.handler}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                value={this.props.filteredRoles}
            >
                {menuItems}
            </IconMenu>            
        );
    }
});

module.exports = UserFilters;