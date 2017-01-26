import React from 'react';

import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';

import RoleCheckboxes from './role-checkboxes.jsx';
import FieldLabel from '../elements/fields/label.jsx';

var blankFindUserMessage = '\u00A0';

var AddUser = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            findUserMessage: blankFindUserMessage,
            foundUser: null,
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
        console.log("Checking whether User is associated: ", searchValue);

        //Check that this user isn't the current logged in user
        var currentUser = this.props.users[this.props.userIndexesById[this.props.currentUserId]];
        var userIsSelfOrAlreadyAssociated = (currentUser.username === searchValue || currentUser.email === searchValue);
        if(userIsSelfOrAlreadyAssociated) {
            var findUserMessage = 'This is you! You are already associated with this Choice, and you can\'t change your own permissions.';
        }
        else {
            //Check whether the user is already associated
            var userIsSelfOrAlreadyAssociated = this.props.users.some(function(user) {
                return user.username === searchValue || user.email === searchValue;
            });
            
            if(userIsSelfOrAlreadyAssociated) {
                var findUserMessage = 'This user is already associated with this Choice. You can edit their permissions below.';
            
                //TODO: Update the add/edit form with this user's permissions, so that they can be edited
            }
        }
        
        
        //Set userChecked to true, so can't recheck
        this.setState({
            userChecked: true,
        });
        
        //If user is associated, disable the submit button
        if(userIsSelfOrAlreadyAssociated) {
            this.disableSubmitButton();
            
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
            var url = '../../users/find_user/' + this.props.choiceId + '/' + searchValue + '.json';
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
        if(!this.state.userChecked) {
            var userSearchValue = this.getUserSearchValueFromInput();
            if(this.checkUserAssociation(userSearchValue)) {
                return false;
            }
        }
        
        //Submit the form by ref
        this.refs.add.submit();
    },
    
    handleSubmit: function(user) {
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
        
        this.props.handlers.submit(user);
    },
    
    handleUserChange: function() {
        this.setState({
            findUserMessage: blankFindUserMessage,
            foundUser: null,
            userChecked: false,
        });
    },
    
    getUserSearchValueFromInput() {
        var usernameInput = $('#add_username');
        var searchValue = usernameInput[0].value;
        return searchValue;
    },
    
    render: function() {
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft={<TopBarBackButton onTouchTap={this.props.handlers.backButtonClick} />}
            iconRight={<RaisedButton 
                disabled={!this.state.canSubmit}
                label="Save" 
                onTouchTap={this.handleSaveClick}
                //primary={true}
                style={{marginTop: '6px'}}
            />}
            sections={this.props.sections} 
            title="Grant Additional Permissions"
        />;

        return (
            <Container topbar={topbar}>
                <Formsy.Form
                    id="add_user_form"
                    method="POST"
                    onValid={this.enableSubmitButton}
                    onInvalid={this.disableSubmitButton}
                    onValidSubmit={this.handleSubmit}
                    noValidate={true}
                    ref="add"
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
                        <div style={{marginTop: '15px'}}>{this.state.findUserMessage}</div>
                    </div>
                    <div className="section">
                        <FieldLabel
                            label='Which additional roles should this user have?'
                            instructions='Additional permissions will add to, but not replace, the default permissions (see "Default Permissions", above) that a user has based on their role in WebLearn'
                        />
                        <RoleCheckboxes nameBase="addRoles" roleStates={this.props.defaultRoles} roles={this.props.roles} />
                    </div>
                    {/*<FormsyToggle
                        label="Notify this user of their additional roles by email"
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