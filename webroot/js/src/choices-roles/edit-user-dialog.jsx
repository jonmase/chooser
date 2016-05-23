import React from 'react';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FlatButton from 'material-ui/FlatButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';

import RoleCheckboxes from './role-checkboxes.jsx';
import FieldLabel from '../elements/label.jsx';

var EditSelectedUsers = React.createClass({
    render: function() {
        var users = this.props.state.users;
        var userIndexesByUsername = this.props.state.userIndexesByUsername;
        var multipleUsersBeingEdited = this.props.state.usersBeingEdited.length > 1;
        var toggleLabel = "Notify the user";
        toggleLabel += multipleUsersBeingEdited?"s":"";
        toggleLabel += " of the changes to their additional roles by email";
        
        var rolesSelected = this.props.state.defaultRoles;   //Use default roles from state for selected Roles
        //If only one user is being edited, show their existing roles, rather than the default roles
        if(this.props.state.usersBeingEdited.length === 1) {
            rolesSelected = {};
            var user = users[userIndexesByUsername[this.props.state.usersBeingEdited[0]]];
            user.roles.map(function(role) {
                rolesSelected[role.id] = true;
            });
        }
        
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.dialogClose}
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
            <FormsyDialog
                actions={actions}
                dialogOnRequestClose={this.props.handlers.dialogClose}
                dialogOpen={this.props.state.editUserDialogOpen}
                dialogTitle="Edit Additional Permissions"
                formId="edit_users_form"
                formOnValidSubmit={this.props.handlers.submit}
            >
                <div>
                    <p>The additional permissions will be edited for the following user{multipleUsersBeingEdited?"s":""}:</p>
                    <ul>
                        {this.props.state.usersBeingEdited.map(function(username, index) {
                            var user = users[userIndexesByUsername[username]];
                            var fullname = user.fullname;
                            var email = user.email;
                            var nameOrEmail = fullname || email;
                            var nameAndEmail = fullname && email;
                            var inputName = "users." + index;
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
                <div className="section">
                    <FieldLabel
                        label='Which additional permissions should {multipleUsersBeingEdited?"these users":"this user"} have?'
                        instructions='This will replace their current additional permissions, and will add to, but not replace, the default permissions (see "Default Permissions", above) that are based on their role in WebLearn'
                    />
                    <RoleCheckboxes nameBase="editRoles" roleStates={rolesSelected} roleOptions={this.props.roleOptions} />
                </div>
                <FormsyToggle
                    label={toggleLabel}
                    defaultToggled={this.props.state.notify}
                    labelPosition="right"
                    name="notify"
                />
            </FormsyDialog>
        );
    }
});

module.exports = EditSelectedUsers;