import React from 'react';
import update from 'react-addons-update';

import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';
import HighlightedText from '../elements/display/text-highlighted.jsx';
import FieldLabel from '../elements/fields/label.jsx';

import UserList from './user-list.jsx';
import RoleCheckboxes from './role-checkboxes.jsx';
import DeleteDialog from './user-delete-dialog.jsx';

var blankFindUserMessage = '\u00A0';
var roleCheckboxesNameBase = 'roles';

var AddUser = React.createClass({
    getInitialState: function () {
        var action = this.props.usersBeingEdited.length > 0?'edit':'add';
        
        var rolesChecked = this.getRolesChecked(action, this.props.usersBeingEdited[0]);

        return {
            action: action,
            canSubmit: false,
            editingCurrentUser: false,
            findUserMessage: blankFindUserMessage,
            foundUser: null,
            originalAction: action,
            rolesChecked: rolesChecked,
            userChecked: false,
            usersBeingEdited: this.props.usersBeingEdited,
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
        console.log("Checking whether User is associated: ", searchValue);

        //Check that this user isn't the current logged in user
        var currentUser = this.props.users[this.props.userIndexesById[this.props.currentUserId]];
        var userIsSelf = (currentUser.username === searchValue || currentUser.email === searchValue);
        if(userIsSelf) {
            this.setState({
                editingCurrentUser: true,
                rolesChecked: {admin: true},
            });
            var findUserMessage = "This is you! You are an Administrator for this Choice, and you can't change your own permissions.";
            
        }
        else {
            this.setState({
                editingCurrentUser: false,
            });
        
            //Check whether the user is already associated
            var userId;
            var userIsAlreadyAssociated = this.props.users.some(function(user) {
                if(user.username === searchValue || user.email === searchValue) {
                    userId = user.id;
                    return true;
                }   
                return false;
            });
            
            if(userIsAlreadyAssociated) {
                var findUserMessage = 'This user is already associated with this Choice. You can edit their permissions below.';
            
                //Update the add/edit form with this user's permissions, so that they can be edited
                //Use the user ID obtained above
                //var user = this.props.users[this.props.userIndexesById[userId]];
                
                var userIndex = this.props.userIndexesById[userId];
                var rolesChecked = this.getRolesChecked('edit', userIndex);
                this.setState({
                    action: 'edit',
                    rolesChecked: rolesChecked,
                    usersBeingEdited: [userIndex],
                });
            }
            else {
                this.setState({
                    action: 'add',
                });
            }
        }
        
        
        //Set userChecked to true, so can't recheck
        this.setState({
            userChecked: true,
        });
        
        var userIsSelfOrAlreadyAssociated = userIsSelf || userIsAlreadyAssociated;
        //If user is associated, disable the submit button
        if(userIsSelfOrAlreadyAssociated) {
            
            this.setState({
                findUserMessage: findUserMessage,
                foundUser: null,
            });
        }
        
        return userIsSelfOrAlreadyAssociated;
    },

    //Look up a user in the DB based on their username/email
    handleFindUser: function() {
        var searchValue = this.getUserSearchValueFromInput();
        console.log("Attempting to find User: ", searchValue);
        
        //If user is not already associated with this choice, look them up
        if(!this.checkUserAssociation(searchValue)) {
            var url = 'users/find_user/' + searchValue + '.json';
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'GET',
                success: function(data) {
                    console.log(data);

                    this.setState({
                        findUserMessage: data.message,
                        foundUser: data.user,
                    });
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(url, status, err.toString());
                    this.setState({
                        //findUserMessage: 'That user wasn\'t found in Chooser, but you can still give them additional roles. They will have these roles when they first access the Choice.',
                        findUserMessage: 'There was an error trying to find this user. Please try again.',
                        foundUser: null,
                        userChecked: false,
                    });
                }.bind(this)
            });
        }
    },
    
    handleRoleChange: function(event, checked) {
        var role = event.target.name.substr(roleCheckboxesNameBase.length + 1);
        
        var rolesChecked = this.state.rolesChecked;
        var newRolesChecked = update(rolesChecked, {
            [role]: {$set: checked},
        });
        this.setState({rolesChecked: newRolesChecked});
        
        /*if(role === 'admin') {
            if(checked) {
            
            }
        }*/
    
        /*console.log('role changed');
        console.log(event.target.name);
        console.log(event.target.checked);
        console.log(checked);*/
    },
    
    handleSaveClick: function() {
        //Make sure user has been checked
        if(this.state.usersBeingEdited.length === 0 && !this.state.userChecked) {
            var userSearchValue = this.getUserSearchValueFromInput();
            if(this.checkUserAssociation(userSearchValue)) {
                return false;
            }
        }
        
        if(this.getRolesCheckedCount() === 0) {
            this.props.handlers.deleteOpen(this.state.usersBeingEdited);
            return false;
        }
        
        //Submit the form by ref
        this.refs.add.submit();
    },
    
    handleSubmit: function(user) {
        var users = [];
        
        //Is there are a user being edited
        if(this.state.usersBeingEdited.length > 0) {
            //Loop through the users being edited and add each to the users array
            this.state.usersBeingEdited.forEach(function(userIndex) {
                var userData = {};
                userData.roles = user.roles;
                userData.id = this.props.users[userIndex].id;
                users.push(userData);
            }, this);
        }
        //Otherwise, adding a new user
        else {
            //If a user was successfully found, set the ID in the data to be posted
            if(this.state.foundUser) {
                user.id = this.state.foundUser.id;
            }
            //If a user was searched for and not found, set the ID to 0
            else if(this.state.foundUser === false) {
                user.id = 0;
            }
            else {
                //Otherwise, the user was not searched for, or an error occurred, so do not set the user id, and the search will be performed on the backend
            }
            
            users.push(user);
        }
        
        this.props.handlers.submit(users);
    },
    
    handleUserChange: function() {
        this.setState({
            editingCurrentUser: false,
            findUserMessage: blankFindUserMessage,
            foundUser: null,
            rolesChecked: {},
            usersBeingEdited: [],
            userChecked: false,
        });
    },
    
    getNoRolesCheckedMessage: function() {
        if(this.state.action === 'edit') {
            var message = "If you do not select any roles, ";
            message += (this.state.usersBeingEdited.length > 1)?"these users":"this user";
            message += " will be removed from the list of users with additional permissions, but will still have their default permissions based on their role in WebLearn";
        }
        else {
            var message = "You must give the user some additional permissions before you can save";
        }
        return message;
    },

    getNotificationToggleLabel: function() {
        var notificationToggleLabel = "Notify the user";
        notificationToggleLabel += (this.state.usersBeingEdited.length > 1)?"s":"";
        notificationToggleLabel += " of ";
        if(this.state.action === 'edit') {
            notificationToggleLabel += "the changes to ";
        }
        notificationToggleLabel += "their additional roles by email";

        return notificationToggleLabel;
    },
    
    getPermissionsLabel: function() {
        return "Which additional permissions should " + ((this.state.usersBeingEdited.length > 1)?"these users":"this user") + " have?";
    },
    
    getRolesChecked: function(action, userIndex) {
        var rolesChecked = {};
        if(action === 'add' || this.props.usersBeingEdited.length > 1) {    //Use props.usersBeingEdited, as call this function before initial state is set, and state.usersBeingEdited will only be more than 1 if props.usersBeingEdited was, as state.usersBeingEdited is only updated if a single already-associated user is 'checked' on the user add page
            //rolesChecked = this.props.defaultRoles;
            rolesChecked = {};
        }
        else {
            var user = this.props.users[userIndex];
            user.roles.map(function(role) {
                rolesChecked[role] = true;
            });
        }
        return rolesChecked;
    },
   
    getRolesCheckedCount: function() {
        var rolesCheckedCount = 0;

        for(var role in this.state.rolesChecked) {
            if(this.state.rolesChecked[role]) {
                rolesCheckedCount++;
            }
        }

        return rolesCheckedCount;
    },
   
    getUserSearchValueFromInput: function() {
        var usernameInput = $('#add_username');
        var searchValue = usernameInput[0].value;
        return searchValue;
    },
    
    getUsersLabel: function() {
        return <p>The additional permissions will be edited for the following user{(this.state.usersBeingEdited.length > 1)?"s":""}:</p>;
    },
    
    render: function() {
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft={<TopBarBackButton onTouchTap={this.props.handlers.backButtonClick} />}
            iconRight={<RaisedButton 
                disabled={!this.state.canSubmit || this.state.editingCurrentUser || (this.state.action === 'add' && this.getRolesCheckedCount() == 0)}
                label={(this.state.originalAction === 'add' && !this.state.userChecked)?"Check User & Save":"Save"}
                onTouchTap={this.handleSaveClick}
                //primary={true}
                style={{marginTop: '6px'}}
            />}
            sections={this.props.sections} 
            title="Set Additional Permissions"
        />;
        
        return (
            <Container topbar={topbar}>
                {this.state.originalAction === 'edit' && 
                    <div>
                        {this.getUsersLabel()}
                        <UserList
                            users={this.props.users}
                            userIndexesToList={this.state.usersBeingEdited}
                        />
                    </div>
                }
                <Formsy.Form
                    id="add_user_form"
                    method="POST"
                    onValid={this.enableSubmitButton}
                    onInvalid={this.disableSubmitButton}
                    onValidSubmit={this.handleSubmit}
                    noValidate={true}
                    ref="add"
                >
                    {this.state.originalAction === 'add' && 
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
                            <div style={{marginTop: '15px'}}><HighlightedText value={this.state.findUserMessage} /></div>
                        </div>
                    }
                    
                    <div className="section">
                        <FieldLabel
                            label={this.getPermissionsLabel()}
                            instructions='Additional permissions can only add to, not remove or replace, the default permissions that a user has based on their role in WebLearn.'
                        />
                        <RoleCheckboxes disableAll={this.state.editingCurrentUser} nameBase={roleCheckboxesNameBase} onChange={this.handleRoleChange} rolesChecked={this.state.rolesChecked} roles={this.props.roles} />
                        {(this.getRolesCheckedCount() == 0) &&
                            <p>
                                <HighlightedText value={this.getNoRolesCheckedMessage()} />
                            </p>
                        }
                    </div>
                    {/*<FormsyToggle
                        label={this.getNotificationToggleLabel()}
                        defaultToggled={this.props.notify}
                        labelPosition="right"
                        name="notify"
                    />*/}
                </Formsy.Form>
                {this.props.snackbar}
                <DeleteDialog
                    handleCancel={this.props.handlers.deleteCancel}
                    handleSubmit={this.props.handlers.deleteSubmit}
                    open={this.props.deleteDialogOpen}
                    users={this.props.users}
                    usersBeingDeleted={this.props.usersBeingDeleted}
                />
            </Container>
        )
        
    }
});

module.exports = AddUser;