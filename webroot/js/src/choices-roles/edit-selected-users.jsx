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
        //Call the handler (handleEditUserDialogOpen in roles-container.jsx) and pass through the currently selected users
        //Must pass the users through here as this handler can also be called from edit-user.jsx, which sends a single user
        this.props.handlers.dialogOpen(this.props.state.usersSelected);
    },
    
    render: function() {
        //Are there any selected users? If not, edit button will be disabled
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