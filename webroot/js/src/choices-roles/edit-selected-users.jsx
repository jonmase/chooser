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
        this.props.handlers.dialogOpen();
    },
    
    handleDialogClose: function() {
        this.props.handlers.dialogClose();
    },
    
    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleDialogClose}
            />,
            <FlatButton
                key="submit"
                label="Submit"
                primary={true}
                type="submit"
                //disabled={!this.state.canSubmit}
                //onTouchTap={this.handleSubmit}    //This doesn't work - can't get data
            />,
        ];
        
        
        return (
            <span>
                <IconButton
                  tooltip="Edit Selected Users"
                  onTouchTap={this.handleDialogOpen}
                    iconClassName="material-icons"
                >
                    edit
                </IconButton>         
                <Dialog
                    title="Edit Users with additional roles"
                    //actions={actions}
                    //modal={false}
                    open={this.props.state.editSelectedUsersDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    <Formsy.Form
                        id="edit_users_form"
                        method="POST"
                        onValidSubmit={this.props.handlers.submit}
                        noValidate
                    >
                        <div>
                            <div>Which additional roles should this user have (this will override the default role(s) that they would be given when they first access the Choice):</div>
                            <RoleCheckboxes nameBase="editRoles" roleStates={this.props.state.defaultRoles} roleOptions={this.props.roleOptions} />
                        </div>
                        <FormsyToggle
                            label="Notify the users of the changes to their additional roles by email"
                            defaultToggled={this.props.state.notify}
                            labelPosition="right"
                            name="notify"
                        />
                        <div style={{textAlign: 'right'}}>
                            {actions}
                        </div>
                    </Formsy.Form>
                </Dialog>
            </span>
        );
    }
});

module.exports = EditSelectedUsers;