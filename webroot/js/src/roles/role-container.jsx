import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import RolesExplanations from './role-explanations.jsx';
import RolesSettingsForm from './role-settings.jsx';
import UsersTable from './user-table.jsx';
import SetUser from './user-set-page.jsx';
import DeleteDialog from './user-delete-dialog.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import SortWrapper from '../elements/wrappers/sort.jsx';


var RolesContainer = React.createClass({
    loadUsersFromServer: function() {
        var url = 'users/get.json';
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
            defaultRoles: this.props.choice.instructor_default_roles,
            deleteDialogOpen: false,
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
            usersBeingDeleted: [],
            usersSelected: [],
        };
    },
    componentWillMount: function() {
        this.loadUsersFromServer();
    },
   
    handleDeleteClick: function(users) {
        this.setState({
            deleteDialogOpen: true,
            usersBeingDeleted: users,
        });
    },

    handleDelete: function() {
        console.log("delete users");
        
        var url = 'users/delete';
        
        var userIds = [];
        this.state.usersBeingDeleted.map(function(userIndex) {
            userIds.push(this.state.users[userIndex].id);
        }, this);
        var data = {users: userIds};
        var successStateChanges = {
            deleteDialogOpen: false,
            usersBeingDeleted: [],
            usersSelected: [],
        };
        var errorMessage = "Error removing user permissions: ";
        
        this.sendUserRequest(url, data, successStateChanges, errorMessage);
    },

    handleDeleteDialogClose: function(users) {
        this.setState({
            deleteDialogOpen: false,
            usersBeingDeleted: [],
        });
    },

    handleGoToSetPage: function(users) {
        var stateData = {
            action: 'set',
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
    
    sendUserRequest: function(url, data, successStateChanges, errorMessage) {
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
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
                    filteredUserIndexes.push(index);
                });
                
                successStateChanges.action = 'index';
                successStateChanges.filteredUserIndexes = filteredUserIndexes;
                successStateChanges.snackbar = snackbar;
                successStateChanges.users = sortedUsers;
                successStateChanges.userIndexesById = this.props.updateIndexesByIdHelper(sortedUsers);
                
                this.setState(successStateChanges);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                //Show the snackbar
                var snackbar = {
                    open: true,
                    message: errorMessage + err.toString(),
                }
                
                //Update state
                this.setState({
                    snackbar: snackbar,
                });
            }.bind(this)
        });
    },
    
    //Submit the set user form
    handleSetUserSubmit: function (users) {
        console.log("Saving User(s) for Choice " + this.props.choice.id + ": ", users);

        //Save the settings
        var url = 'users/add';
        var data = {users: users};
        var successStateChanges = {};
        var errorMessage = "Error saving user permissions: ";
        
        this.sendUserRequest(url, data, {}, errorMessage);
    },
    
    //Update state when user role filter is changed
    handleFilterUsers: function(event, filteredRoles) {
        console.log("User Role Filter changed");
        
        /*var filteredUserIndexes = this.filterUsers(this.state.users, filteredRoles);
        
        this.setState({
            filterRoles: roles,
            filteredUserIndexes: filteredUserIndexes,
            selectAllSelected: false,
        });*/
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
        var url = 'users/role_settings';
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

    handleSort: function(field, fieldType) {
        var direction = 'asc';
        if(field === this.state.sort.field) {
            if(this.state.sort.direction.toLowerCase() === 'asc') {
                direction = 'desc';
            }
        }
    
        var usersState = this.props.sortHelper(this.props.deepCopyHelper(this.state.users), field, fieldType, direction);
        
        this.setState({
            users: usersState,
            indexesById: this.props.updateIndexesByIdHelper(usersState),
            sort: {
                direction: direction,
                field: field,
                fieldType: fieldType,
            },
        });
    },

    render: function() {
        var settingsHandlers={
            change: this.handleSettingsChange,
            submit: this.handleSettingsSubmit,
        };

        var setUserHandlers={
            backButtonClick: this.handleGoToIndexPage,
            deleteCancel: this.handleDeleteDialogClose,
            deleteOpen: this.handleDeleteClick,
            deleteSubmit: this.handleDelete,
            submit: this.handleSetUserSubmit,
        };
    
        var selectUserHandlers={
            change: this.handleSelectUserChange,
        };
    
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={null}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name} />}
        />;

        var snackbar = <Snackbar
                            open={this.state.snackbar.open}
                            message={this.state.snackbar.message}
                            autoHideDuration={3000}
                            onRequestClose={this.handleSnackbarClose}
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
                            deleteButtonClickHandler={this.handleDeleteClick}
                            filteredUserIndexes={this.state.filteredUserIndexes}
                            filterRoles={this.state.filterRoles} 
                            filterHandler={this.handleFilterUsers}
                            roles={this.props.roles} 
                            roleIndexesById={this.props.roleIndexesById} 
                            selectUserHandlers={selectUserHandlers}
                            setButtonClickHandler={this.handleGoToSetPage}
                            sort={this.state.sort}
                            sortHandler={this.handleSort}
                            users={this.state.users}
                            userIndexesById={this.state.userIndexesById}
                            usersBeingEdited={this.state.usersBeingEdited}
                            usersSelected={this.state.usersSelected}
                        />
                        {snackbar}
                    </div>
                    <DeleteDialog
                        handleCancel={this.handleDeleteDialogClose}
                        handleSubmit={this.handleDelete}
                        open={this.state.deleteDialogOpen}
                        users={this.state.users}
                        usersBeingDeleted={this.state.usersBeingDeleted}
                    />
                </Container>
            );
        }
        else {
            return (
                <div>
                    <SetUser
                        choiceId={this.props.choice.id} 
                        currentUserId={this.props.currentUserId} 
                        dashboardUrl={this.props.dashboardUrl} 
                        defaultRoles={this.state.defaultRoles}
                        deleteDialogOpen={this.state.deleteDialogOpen}
                        handlers={setUserHandlers}
                        notify={this.props.notify}
                        roles={this.props.roles} 
                        sections={this.props.sections} 
                        snackbar={snackbar}
                        users={this.state.users}
                        usersBeingDeleted={this.state.usersBeingDeleted}
                        usersBeingEdited={this.state.usersBeingEdited}
                        userIndexesById={this.state.userIndexesById}
                    />
                </div>
            );
        }
    }
});

module.exports = SortWrapper(RolesContainer);