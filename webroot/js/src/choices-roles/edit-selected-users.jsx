var React = require('react');
var Formsy = require('formsy-react');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var FlatButton = require('material-ui/lib/flat-button');
var IconButton = require('material-ui/lib/icon-button');
var Dialog = require('material-ui/lib/dialog');
var RoleCheckboxes = require('./role-checkboxes.jsx');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var EditSelectedUsers = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },

    handleDialogOpen: function() {
        this.props.handlers.dialogOpen(this.props.state.usersSelected);
    },
    
    render: function() {
        var noUsersSelected = this.props.state.usersSelected.length===0;
        return (
            <IconButton
                tooltip={noUsersSelected?"":"Edit Selected Users"}
                onTouchTap={this.handleDialogOpen}
                iconClassName="material-icons"
                disabled={noUsersSelected}
            >
                edit
            </IconButton>         
        );
    }
});

module.exports = EditSelectedUsers;