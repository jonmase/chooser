import React from 'react';

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

import RoleCheckboxes from './role-checkboxes.jsx';
import FieldLabel from '../elements/fields/label.jsx';

var blankFindUserMessage = '\u00A0';

var AddUser = React.createClass({
    getInitialState: function () {
        var action = this.props.usersBeingEdited.length > 0?'edit':'add';
        
        var roleStates = this.getRoleStates(action, this.props.usersBeingEdited[0]);

        return {
            action: action,
            canSubmit: false,
            findUserMessage: blankFindUserMessage,
            foundUser: null,
            originalAction: action,
            roleStates: roleStates,
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
            this.disableSubmitButton();
            var findUserMessage = 'This is you! You are an Administrator for this Choice, and you can\'t change your own permissions.';
        }
        else {
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
            
                //TODO: Update the add/edit form with this user's permissions, so that they can be edited
                //Use the user ID obtained above
                //var user = this.props.users[this.props.userIndexesById[userId]];
                
                var userIndex = this.props.userIndexesById[userId];
                var roleStates = this.getRoleStates('edit', userIndex);
                this.setState({
                    action: 'edit',
                    roleStates: roleStates,
                    usersBeingEdited: [userIndex],
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
            var url = 'users/find_user/' + this.props.choiceId + '/' + searchValue + '.json';
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
    
    handleSaveClick: function() {
        //Make sure user has been checked
        if(this.state.usersBeingEdited.length === 0 && !this.state.userChecked) {
            var userSearchValue = this.getUserSearchValueFromInput();
            if(this.checkUserAssociation(userSearchValue)) {
                return false;
            }
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
            findUserMessage: blankFindUserMessage,
            foundUser: null,
            roleStates: this.props.defaultRoles,
            usersBeingEdited: [],
            userChecked: false,
        });
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
    
    getRoleStates: function(action, userIndex) {
        var roleStates = {};
        if(action === 'add' || this.props.usersBeingEdited.length > 1) {    //Use props.usersBeingEdited, as call this function before initial state is set, and state.usersBeingEdited will only be more than 1 if props.usersBeingEdited was, as state.usersBeingEdited is only updated if a single already-associated user is 'checked' on the user add page
            roleStates = this.props.defaultRoles;
        }
        else {
            var user = this.props.users[userIndex];
            user.roles.map(function(role) {
                roleStates[role] = true;
            });
        }
        return roleStates;
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
                disabled={!this.state.canSubmit}
                label={(this.state.userChecked)?"Save":"Check User & Save"}
                onTouchTap={this.handleSaveClick}
                //primary={true}
                style={{marginTop: '6px'}}
            />}
            sections={this.props.sections} 
            title="Set Additional Permissions"
        />;
        
        
        //Get the array of roles not including view
        var rolesWithoutViewer = this.props.roles.slice(1);
        
        return (
            <Container topbar={topbar}>
                {this.state.originalAction === 'edit' && 
                    <div>
                        {this.getUsersLabel()}
                        <List style={{paddingTop: '0px', marginBottom: '15px'}}>
                            {this.state.usersBeingEdited.map(function(userIndex) {
                                var user = this.props.users[userIndex];
                                var nameOrEmail = user.fullname || user.email;
                                var nameAndEmail = user.fullname && user.email;
                                return (
                                    <ListItem 
                                        disabled={true}
                                        key={user.username}
                                        primaryText={user.username}
                                        secondaryText={nameOrEmail?(user.fullname + (nameAndEmail?", ":"") + user.email):false}
                                    />
                                );
                            }, this)}
                        </List>
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
                        <RoleCheckboxes nameBase="roles" roleStates={this.state.roleStates} roles={rolesWithoutViewer} />
                    </div>
                    {/*<FormsyToggle
                        label={this.getNotificationToggleLabel()}
                        defaultToggled={this.props.notify}
                        labelPosition="right"
                        name="notify"
                    />*/}
                </Formsy.Form>

            </Container>
        )
        
    }
});

module.exports = AddUser;