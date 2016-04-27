var React = require('react');
//var Formsy = require('formsy-react');
//var RoleCheckboxes = require('./role-checkboxes.jsx');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var IconButton = require('material-ui/lib/icon-button');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var UserFilters = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },
    
    nameBase: "filterRoles",
    
    render: function() {
        var menuItems = this.props.roleOptions.map(function(role) {
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
            /*<div>
                <Formsy.Form
                    id="user_filters_form"
                    method="POST"
                    noValidate
                >
                    <span style={this.props.titleStyle}>Filter Roles:</span> 
                    <RoleCheckboxes nameBase={this.nameBase} roleStates={this.props.state.filterRoles} roleOptions={this.props.roleOptions} onChange={this.props.handlers.change} arrange='horizontal' id="filter_roles" />
                </Formsy.Form>
            </div>*/
        );
    }
});

module.exports = UserFilters;