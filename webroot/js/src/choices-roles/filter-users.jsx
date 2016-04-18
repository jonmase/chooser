var React = require('react');
var Formsy = require('formsy-react');
var RoleCheckboxes = require('./role-checkboxes.jsx');

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
        return (
            <div>
                <Formsy.Form
                    id="user_filters_form"
                    method="POST"
                    noValidate
                >
                    {/* TODO: Add clear filters link */}
                    <span style={this.props.titleStyle}>Filter Roles:</span> 
                    <RoleCheckboxes nameBase={this.nameBase} roleStates={this.props.state.filterRoles} roleOptions={this.props.roleOptions} onChange={this.props.handlers.change} arrange='horizontal' id="filter_roles" />
                </Formsy.Form>
            </div>
        );
    }
});

module.exports = UserFilters;