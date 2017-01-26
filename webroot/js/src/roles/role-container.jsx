import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import RolesExplanations from './role-explanations.jsx';
import RolesSettingsForm from './role-settings.jsx';
import UsersTable from './user-table.jsx';
import AddUser from './user-add-page.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';


var RolesContainer = React.createClass({
    loadUsersFromServer: function() {
        var url = '../../users/get/' + this.props.choice.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                var filteredUserIndexes = [];
                data.users.forEach(function(user, index) {
                    //userIndexesByUsername[user.username] = index;
                    filteredUserIndexes.push(index);
                });
                
                var stateData = {
                    filteredUserIndexes: filteredUserIndexes,
                    users: data.users,
                    userIndexesById: data.userIndexesById,
                };
                
                
                this.setState(stateData);
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {
            action: 'index',
            addUserDialogOpen: false,
            defaultRoles: this.props.choice.instructor_default_roles,
            editSelectedUsersDialogOpen: false,
            editUserDialogOpen: false,
            //filterRoles: filterRoles,
            filterRoles: [],
            filteredUserIndexes: [],
            notify: this.props.choice.notify_additional_permissions,
            selectAllSelected: true,
            settingsButton: {
                disabled: true,
                label: 'Saved',
            },
            snackbar: {
                open: false,
                message: '',
            },
            sortField: 'username',
            sortDirection: 'ASC',
            users: [],
            userIndexesById: [],
            usersBeingEdited: [],
            usersSelected: [],
        };
    },
    componentWillMount: function() {
        this.loadUsersFromServer();
    },
    
    handleGoToAddPage: function() {
        this.setState({
            action: 'add',
        });
    },

    handleGoToIndexPage: function() {
        this.setState({
            action: 'index',
        });
    },

    //Submit the add user form
    handleAddUserSubmit: function (user, foundUserId) {
        console.log("Saving User for Choice " + this.props.choice.id + ": ", user);
        
        //If user was found, add the ID to the user data
        if(typeof(foundUserId) !== "undefined") {
            user.id = foundUserId;
        }
        //If user was looked for and not found, set the user ID to false
        else if(foundUserId === false) {
            user.id = 0;
        }
        
        //Save the settings
        var url = '../../users/add/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: user,
            success: function(returnedData) {
                //console.log(returnedData.response);
                
                //Show the snackbar
                var snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                
                var currentUsers = this.state.users;    //Get the current users
                
                currentUsers.push(returnedData.user);   //Add the new user to current users
                currentUsers = this.sortUsers(currentUsers, this.state.sortUsersField);
                
                var userIndexesByUsername = {};
                currentUsers.forEach(function(user, index) {
                    userIndexesByUsername[user.username] = index;
                });
                
                //Refilter the users to account for new roles/removed users
                var filteredUserIndexes = this.filterUsers(currentUsers, this.state.filterRoles);
                
                //Update state with the new users array
                this.setState({
                    users: currentUsers,
                    userIndexesByUsername: userIndexesByUsername,
                    filteredUserIndexes: filteredUserIndexes,
                    snackbar: snackbar,
                });
                this.handleAddUserDialogClose();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    
    handleEditUserDialogOpen: function(users) {
        this.setState({
            editUserDialogOpen: true,
            usersBeingEdited: users,
        });
    },

    handleEditUserDialogClose: function() {
        this.setState({
            editUserDialogOpen: false,
            usersBeingEdited: [],
        });
    },

    //Submit the edit user form
    handleEditUserSubmit: function (data) {
        console.log("Editing User(s) for Choice " + this.props.choice.id + ": ", data);
        
        //Get the state
        var currentUsers = this.state.users;
        var usersBeingEdited = this.state.usersBeingEdited;
        var userIndexesByUsername = this.state.userIndexesByUsername;
        var filterRoles = this.state.filterRoles;
        
        var userIndexesBeingEdited = [];    //Keep track of the indexes of the users we are editing
        data.users = [];    //Create array for adding the users to the data that will be sent
        
        //Loop through the users being edited...
        usersBeingEdited.forEach(function(username) {
            var userIndex = userIndexesByUsername[username];    //Get the index of the user
            data.users.push(currentUsers[userIndex].id);   //Add the user ID to the data.users array
            userIndexesBeingEdited.push(userIndex); //Add the index to userIndexesBeingEdited array
        });
        
        //Save the users' roles
        var url = '../../users/edit/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(returnedData) {
                console.log(returnedData.response);
                
                //Loop through the indexes of the users being edited
                //Have to loop backwards to avoid changing the indexes when splicing
                var userIndex = currentUsers.length;
                while(userIndex--) {    //Loop through the users array backwards
                    if(userIndexesBeingEdited.indexOf(userIndex) !== -1) {  //Is this user being edited?
                        //User ID will only be in returnedData.deletedUsers array if user was successfully deleted
                        if(returnedData.deletedUsers.indexOf(currentUsers[userIndex].id) !== -1) { 
                            //Remove the user from the users array
                            currentUsers.splice(userIndex, 1);
                        }
                        
                        //User ID will only be in returnedData.savedUsers array if user was successfully updated
                        if(returnedData.savedUsers.indexOf(currentUsers[userIndex].id) !== -1) { 
                            //Update the roles of the users being edited, to update state
                            currentUsers[userIndex].roles = returnedData.roles;
                        }
                        
                        //TODO: Deal with users that were not saved (in returnedData.failedUsers)
                    }
                }
                
                //Refilter the users to account for new roles/removed users
                var filteredUserIndexes = this.filterUsers(currentUsers, filterRoles);
                
                //Show the snackbar
                var snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                
                //Update state with the new users array and filteredIndexes
                this.setState({
                    users: currentUsers,
                    filteredUserIndexes: filteredUserIndexes,
                    usersBeingEdited: [],
                    usersSelected: [],  //Unselect users - otherwise it will be confusing if users are no longer shown as they don't match the filters, but remain selected.
                    snackbar: snackbar,
                });
                this.handleEditUserDialogClose();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    
    //Update state when user role filter is changed
    handleFilterUsersChange: function(event, roles) {
        console.log("User Role Filter changed");
        
        var filteredUserIndexes = this.filterUsers(this.state.users, roles);
        
        this.setState({
            filterRoles: roles,
            filteredUserIndexes: filteredUserIndexes,
            selectAllSelected: false,
        });
    },
    
    filterUsers: function(users, roles) {
        var filteredUserIndexes = [];
        
        users.forEach(function(user, index) {
            if(roles.length === 0 || user.roles.some(function(role) { 
                return roles.indexOf(role.id) > -1; 
            })) {
                filteredUserIndexes.push(index);
            }
        });
        
        return filteredUserIndexes;
    },

    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    handleSelectUserChange: function(rowIndexes) {
        var userIndexes = [];
        var filteredUserIndexes = this.state.filteredUserIndexes;
        
        rowIndexes.forEach(function(index) {
            userIndexes.push(filteredUserIndexes[index]);
        });
        
        //Special case when all rows are selected, users = "all"
        //Caused issues in combination with filters, so disabled
        //TODO: Check whether Material-UI updates have fixed issues
        //Problem came when selecting all filtered, then removing filters, all of the users would be selected not just those that were visible when filtered
        /*if(rowIndexes === "all") {
            filteredUserIndexes.forEach(function(userIndex) {
                userIndexes.push(userIndex);
            });
            this.setState({
                selectAllSelected: true,
            });
        }
        //Special case when nno rows are selected, users = "none"
        else if(rowIndexes === "none") {
            this.setState({
                selectAllSelected: false,
            });
            //Leave userIndexes empty
        }
        else {
            rowIndexes.forEach(function(index) {
                userIndexes.push(filteredUserIndexes[index]);
            });
        }*/
    
        //Sort as numbers rather than strings
        userIndexes.sort(function(a, b) {
            return a - b;
        });
        console.log(userIndexes);
        
        var usersSelected = [];
        this.state.users.forEach(function(user, index) {
            if(userIndexes.indexOf(index) !== -1) {
                usersSelected.push(user.username);
            }
        });
        
        //Leaves last item selected on select none if don't use setTimeout
        //See https://github.com/callemall/material-ui/issues/1897
        var thisThis = this;
        setTimeout(function() {
            thisThis.setState({
                usersSelected: usersSelected,
            });
        }, 1);
    },
    
    handleSettingsChange: function() {
        this.setState({
            settingsButton: {
                disabled: false,
                label: 'Save',
            },
        });
    },
    
    //Submit the setting forms
    handleSettingsSubmit: function (settings) {
        this.setState({
            settingsButton: {
                disabled: true,
                label: 'Saving',
            },
        });

        console.log("Saving settings for Choice " + this.props.choice.id + ": ", settings);
        
        //Save the settings
        var url = '../role_settings/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: settings,
            success: function(returnedData) {
                console.log(returnedData.response);
                //Update the state with the updated data, and set 
                var stateData = settings;
                stateData.settingsButton = {
                    disabled: true,
                    label: 'Saved',
                };
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    settingsButton: {
                        disabled: false,
                        label: 'Resave',
                    },
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
                console.error(url, status, err.toString());
            }.bind(this)
        }); 
    },

    handleSortUsersChange: function(event, value) {
        console.log("User Sort changed to " + value);
        
        var currentUsers = this.sortUsers(this.state.users, value);
       
        //Update state with the sorted users array and sortField
        this.setState({
            sortUsersField: value,
            users: currentUsers,
        });
        return false;
    },
    
    sortUsers: function(users, sortField) {
        users.sort(function (a, b) {
            var aField = a[sortField];
            var bField = b[sortField];
            var aString = (aField === null) ? "" : "" + aField;
            var bString = (bField === null) ? "" : "" + bField;
            if (aString > bString) {
                return 1;
            }
            if (aString < bString) {
                return -1;
            }
            //values are equal
            return 0;
        });
        return users;
    },

    render: function() {
        var settingsHandlers={
            change: this.handleSettingsChange,
            submit: this.handleSettingsSubmit,
        };

        var addUserHandlers={
            backButtonClick: this.handleGoToIndexPage,
            submit: this.handleAddUserSubmit,
        };
    
        var editUserHandlers={
            dialogOpen: this.handleEditUserDialogOpen,
            dialogClose: this.handleEditUserDialogClose,
            submit: this.handleEditUserSubmit,
        };
    
        var filterUsersHandlers={
            change: this.handleFilterUsersChange,
        };
    
        var selectUserHandlers={
            change: this.handleSelectUserChange,
        };
    
        var sortUsersHandlers={
            change: this.handleSortUsersChange,
        };
    
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={null}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name} />}
        />;

        if(this.state.action === 'index') {
            return (
                <Container topbar={topbar} title="Dashboard - User Permissions">
                    <div>
                        <RolesExplanations 
                            roles={this.props.roles} 
                        />
                        <RolesSettingsForm 
                            state={this.state} 
                            roles={this.props.roles} 
                            roleIndexesById={this.props.roleIndexesById} 
                            handlers={settingsHandlers}
                        />
                        <UsersTable 
                            choiceId={this.props.choice.id} 
                            state={this.state} 
                            roles={this.props.roles} 
                            roleIndexesById={this.props.roleIndexesById} 
                            addButtonClickHandler={this.handleGoToAddPage}
                            editUserHandlers={editUserHandlers}
                            filterUsersHandlers={filterUsersHandlers}
                            selectUserHandlers={selectUserHandlers}
                            sortUsersHandlers={sortUsersHandlers}
                        />
                        <Snackbar
                            open={this.state.snackbar.open}
                            message={this.state.snackbar.message}
                            autoHideDuration={3000}
                            onRequestClose={this.handleSnackbarClose}
                        />
                    </div>
                </Container>
            );
        }
        else {
            return (
                <AddUser
                    choiceId={this.props.choice.id} 
                    currentUserId={this.props.currentUserId} 
                    dashboardUrl={this.props.dashboardUrl} 
                    defaultRoles={this.state.defaultRoles}
                    handlers={addUserHandlers}
                    notify={this.props.notify}
                    roles={this.props.roles} 
                    sections={this.props.sections} 
                    users={this.state.users}
                    userIndexesById={this.state.userIndexesById}
                />
            );
        }
    }
});

module.exports = RolesContainer;