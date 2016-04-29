import React from 'react';

import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import Dialog from 'material-ui/Dialog';

import RoleCheckboxes from './role-checkboxes.jsx';

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
    
    handleDialogOpen: function() {
        this.props.handlers.dialogOpen();
    },
    
    handleDialogClose: function() {
        this.props.handlers.dialogClose();
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
                onTouchTap={this.handleDialogClose}
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
                    onTouchTap={this.handleDialogOpen}
                    iconClassName="material-icons"
                >
                    add
                </IconButton>         
                <Dialog
                    title="Add User with Additional Roles"
                    //actions={actions}
                    //modal={false}
                    open={this.props.state.addUserDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    <Formsy.Form
                        id="add_user_form"
                        method="POST"
                        onValid={this.enableSubmitButton}
                        onInvalid={this.disableSubmitButton}
                        onValidSubmit={this.handleSubmit}
                        noValidate
                    >
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
                        <div>
                            <p>
                                Which additional roles should this user have? <br />
                                <span className="sublabel">Additional permissions will add to, but not replace, the default permissions (see "Default Permissions", above) that a user has based on their role in WebLearn</span>
                            </p>
                            <RoleCheckboxes nameBase="addRoles" roleStates={this.props.state.defaultRoles} roleOptions={this.props.roleOptions} />
                        </div>
                        <FormsyToggle
                            label="Notify this user of their additional roles by email"
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

module.exports = AddUser;