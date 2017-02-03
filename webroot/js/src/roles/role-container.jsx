import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import RolesExplanations from './role-explanations.jsx';
import RolesSettingsForm from './role-settings.jsx';
import UsersTable from './user-table.jsx';
import AddEditUser from './user-add-edit-page.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import SortWrapper from '../elements/wrappers/sort.jsx';


var RolesContainer = React.createClass({
    loadUsersFromServer: function() {
        var url = '../../users/get/' + this.props.choice.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                //Sort the returned users
                var sortedUsers = this.props.sortHelper(this.props.deepCopyHelper(data.users), this.state.sort.field, this.state.sort.fieldType, this.state.sort.direction);
                
                //Add all the users to the filteredUserIndexes array
                var filteredUserIndexes = [];
                sortedUsers.forEach(function(user, index) {
                    //userIndexesByUsername[user.username] = index;
                    filteredUserIndexes.push(index);
                });
                
                var stateData = {
                    filteredUserIndexes: filteredUserIndexes,
                    users: sortedUsers,
                    userIndexesById: this.props.updateIndexesByIdHelper(sortedUsers),
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
            sort: {
                field: 'username',
                fieldType: 'text',
                direction: 'ASC',
            },
            users: [],
            userIndexesById: [],
            usersBeingEdited: [],
            usersSelected: [],
        };
    },
    componentWillMount: function() {
        this.loadUsersFromServer();
    },
   
    handleGoToAddEditPage: function(users) {
        var stateData = {
            action: 'addedit',
        };
        
        if(users) {
            stateData.usersBeingEdited = users;
        }
        else {
            stateData.usersBeingEdited = [];
        }
        
        this.setState(stateData);
    },

    handleGoToIndexPage: function() {
        this.setState({
            action: 'index',
            usersBeingEdited: [],
        });
    },

    //Submit the add user form
    handleAddEditUserSubmit: function (users) {
        console.log("Saving User(s) for Choice " + this.props.choice.id + ": ", users);

        //Save the settings
        var url = '../../users/add/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: {
                users: users,
            },
            success: function(returnedData) {
                console.log(returnedData.response);
                
                //Show the snackbar
                var snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                
                //Sort the returned users
                var sortedUsers = this.props.sortHelper(this.props.deepCopyHelper(returnedData.users), this.state.sort.field, this.state.sort.fieldType, this.state.sort.direction);
                
                //Add all the users to the filteredUserIndexes array
                var filteredUserIndexes = [];
                sortedUsers.forEach(function(user, index) {
                    //userIndexesByUsername[user.username] = index;
                    filteredUserIndexes.push(index);
                });
                
                this.setState({
                    action: 'index',
                    filteredUserIndexes: filteredUserIndexes,
                    snackbar: snackbar,
                    users: sortedUsers,
                    userIndexesById: this.props.updateIndexesByIdHelper(sortedUsers),
                });
                
                
                /*var currentUsers = this.state.users;    //Get the current users
                
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
                    action: 'index',
                    //users: currentUsers,
                    //userIndexesByUsername: userIndexesByUsername,
                    //filteredUserIndexes: filteredUserIndexes,
                    snackbar: snackbar,
                });*/
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                //Show the snackbar
                var snackbar = {
                    open: true,
                    message: "Error saving user permissions: " + err.toString(),
                }
                
                //Update state with the new users array
                this.setState({
                    snackbar: snackbar,
                });
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
        //var filteredUserIndexes = this.state.filteredUserIndexes;
        
        this.setState({
            usersSelected: rowIndexes,
        });
        
        /*rowIndexes.forEach(function(index) {
            userIndexes.push(filteredUserIndexes[index]);
        });
        
        //Special case when all rows are selected, users = "all"
        //Caused issues in combination with filters, so disabled
        //TODO: Check whether Material-UI updates have fixed issues
        //Problem came when selecting all filtered, then removing filters, all of the users would be selected not just those that were visible when filtered
        if(rowIndexes === "all") {
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
        }
    
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
        }, 1);*/
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

        var addEditUserHandlers={
            backButtonClick: this.handleGoToIndexPage,
            submit: this.handleAddEditUserSubmit,
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
                            addEditButtonClickHandler={this.handleGoToAddEditPage}
                            choiceId={this.props.choice.id} 
                            filteredUserIndexes={this.state.filteredUserIndexes}
                            filterRoles={this.state.filterRoles} 
                            filterUsersHandlers={filterUsersHandlers}
                            roles={this.props.roles} 
                            roleIndexesById={this.props.roleIndexesById} 
                            selectUserHandlers={selectUserHandlers}
                            sortUsersHandlers={sortUsersHandlers}
                            users={this.state.users}
                            userIndexesById={this.state.userIndexesById}
                            usersBeingEdited={this.state.usersBeingEdited}
                            usersSelected={this.state.usersSelected}
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
                <AddEditUser
                    choiceId={this.props.choice.id} 
                    currentUserId={this.props.currentUserId} 
                    dashboardUrl={this.props.dashboardUrl} 
                    defaultRoles={this.state.defaultRoles}
                    handlers={addEditUserHandlers}
                    notify={this.props.notify}
                    roles={this.props.roles} 
                    sections={this.props.sections} 
                    users={this.state.users}
                    usersBeingEdited={this.state.usersBeingEdited}
                    userIndexesById={this.state.userIndexesById}
                />
            );
        }
    }
});

module.exports = SortWrapper(RolesContainer);