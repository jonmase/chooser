var React = require('react');
var Formsy = require('formsy-react');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var FlatButton = require('material-ui/lib/flat-button');
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

    handleDialogClose: function() {
        this.props.handlers.dialogClose();
    },
    
    render: function() {
        var users = this.props.state.users;
        var userIndexesByUsername = this.props.state.userIndexesByUsername;
        var multipleUsersBeingEdited = this.props.state.usersBeingEdited.length > 1;
        var toggleLabel = "Notify the user";
        toggleLabel += multipleUsersBeingEdited?"s":"";
        toggleLabel += " of the changes to their additional roles by email";
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
            <Dialog
                title="Edit Additional Roles"
                //actions={actions}
                //modal={false}
                open={this.props.state.editUserDialogOpen}
                onRequestClose={this.handleDialogClose}
            >
                <div>
                    The additional roles will be edited for the following user{multipleUsersBeingEdited?"s":""}:
                    <ul>
                        {this.props.state.usersBeingEdited.map(function(username) {
                            var user = users[userIndexesByUsername[username]];
                            var fullname = user.fullname;
                            var email = user.email;
                            var nameOrEmail = fullname || email;
                            var nameAndEmail = fullname && email;
                            return (
                                <li key={username}>
                                    {username} 
                                    {nameOrEmail?" (":""}
                                    {fullname}
                                    {nameAndEmail?", ":""}
                                    {email}
                                    {nameOrEmail?")":""}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <Formsy.Form
                    id="edit_users_form"
                    method="POST"
                    onValidSubmit={this.props.handlers.submit}
                    noValidate
                >
                    <div>
                        <p>
                            Which additional roles should {multipleUsersBeingEdited?"these users":"this user"} have? <br />
                            <span className="sublabel">This will replace their current additional roles, and will override the default role(s) that they would be given when they first access the Choice</span>
                        </p>
                        <RoleCheckboxes nameBase="editRoles" roleStates={this.props.state.defaultRoles} roleOptions={this.props.roleOptions} />
                    </div>
                    <FormsyToggle
                        label={toggleLabel}
                        defaultToggled={this.props.state.notify}
                        labelPosition="right"
                        name="notify"
                    />
                    <div style={{textAlign: 'right'}}>
                        {actions}
                    </div>
                </Formsy.Form>
            </Dialog>
        );
    }
});

module.exports = EditSelectedUsers;