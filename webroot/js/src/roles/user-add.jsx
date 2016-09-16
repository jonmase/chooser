import React from 'react';

import FormsyText from 'formsy-material-ui/lib/FormsyText';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';

import RoleCheckboxes from './role-checkboxes.jsx';
import FieldLabel from '../elements/fields/label.jsx';

var AddUser = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            userChecked: false,
        };
    },

    enableSubmitButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false
        });
    },

    //Check whether user is already associated with this Choice
    checkUserAssociation: function(searchValue) {
        var userAlreadyAssociated = this.props.handlers.checkUserAssociation(searchValue);
        //Set userChecked to true, so can't recheck
        this.setState({
            userChecked: true,
        });
        //If user is associated, disable the submit button
        if(userAlreadyAssociated) {
            this.disableSubmitButton();
        }
        return userAlreadyAssociated;
    },

    //Checks whether we can get the user details
    handleFindUser: function() {
        var searchValue = this.getUserSearchValueFromInput();
        //If user is not already associated, try to find them in the system
        if(!this.checkUserAssociation(searchValue)) {
            this.props.handlers.findUser(searchValue);
        }
    },
    
    //Submit the user form (if using action inside Form)
    handleSubmit: function (user) {
        if(!this.state.userChecked) {
            if(this.checkUserAssociation(user.username)) {
                return false;
            }
        }
    
        this.props.handlers.submit(user);
    },
    
    handleUserChange: function() {
        this.props.handlers.change();
        this.setState({
            userChecked: false,
        });
    },
    
    getUserSearchValueFromInput() {
        var usernameInput = $('#add_username');
        var searchValue = usernameInput[0].value;
        return searchValue;
    },
    
    render: function() {
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
                disabled={!this.state.canSubmit}
                //onTouchTap={this.handleSubmit}    //This doesn't work - can't get data
            />,
        ];
        
        
        return (
            <span>
                <IconButton
                    tooltip="Add User"
                    onTouchTap={this.props.handlers.dialogOpen}
                    iconClassName="material-icons"
                >
                    add
                </IconButton>         
                <FormsyDialog
                    actions={actions}
                    dialogOnRequestClose={this.props.handlers.dialogClose}
                    dialogOpen={this.props.state.addUserDialogOpen}
                    dialogTitle="Add User with Additional Roles"
                    formId="add_user_form"
                    formOnValid={this.enableSubmitButton}
                    formOnInvalid={this.disableSubmitButton}
                    formOnValidSubmit={this.handleSubmit}
                >
                    <div className="section">
                        <FormsyText 
                            name="username"
                            id="add_username"
                            hintText="Email address or SSO username" 
                            floatingLabelText="Email/Username (required)"
                            validations="minLength:1"
                            validationError="Please enter the email address or Oxford SSO username for the user you wish to add"
                            required
                            onChange={this.handleUserChange}
                        />
                        <FlatButton
                            label="Check User"
                            type="button"
                            disabled={!this.state.canSubmit || this.state.userChecked}
                            onTouchTap={this.handleFindUser}
                            style={{marginLeft: '10px'}}
                        />
                        <div>{this.props.state.findUserMessage}</div>
                    </div>
                    <div className="section">
                        <FieldLabel
                            label='Which additional roles should this user have?'
                            instructions='Additional permissions will add to, but not replace, the default permissions (see "Default Permissions", above) that a user has based on their role in WebLearn'
                        />
                        <RoleCheckboxes nameBase="addRoles" roleStates={this.props.state.defaultRoles} roleOptions={this.props.roleOptions} />
                    </div>
                    <FormsyToggle
                        label="Notify this user of their additional roles by email"
                        defaultToggled={this.props.state.notify}
                        labelPosition="right"
                        name="notify"
                    />
                </FormsyDialog>
            </span>
        );
    }
});

module.exports = AddUser;