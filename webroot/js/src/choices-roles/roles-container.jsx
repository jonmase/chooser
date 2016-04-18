var React = require('react');
var RolesSettingsForm = require('./roles-settings.jsx');
var UsersTable = require('./users-table.jsx');
var Snackbar = require('material-ui/lib/snackbar');

var blankFindUserMessage = '\u00A0';

var RolesContainer = React.createClass({
    getInitialState: function () {
        var filterRoles = {};
        this.props.roleOptions.forEach(function(role) {
            filterRoles[role] = false;
        });
    
        return {
            addUserDialogOpen: false,
            defaultRoles: this.props.initialDefaultRoles,
            editUserDialogOpen: false,
            filterRoles: filterRoles,
            sortUsersField: this.props.initialUserSortField,
            findUserMessage: {blankFindUserMessage},
            foundUser: {},
            notify: this.props.initialNotify,
            settingsButton: {
                disabled: true,
                label: 'Saved',
            },
            snackbar: {
                open: false,
                message: '',
            },
            users: this.props.initialUsers,
        };
    },
    
    handleAddUserChange: function() {
        this.setState({
            findUserMessage: blankFindUserMessage,
            foundUser: {},
        });
    },

    handleAddUserDialogOpen: function() {
        this.setState({
            addUserDialogOpen: true,
            findUserMessage: blankFindUserMessage,
            foundUser: {},
        });
    },

    handleAddUserDialogClose: function() {
        this.setState({
            addUserDialogOpen: false,
        });
    },

    //Submit the add user form
    handleAddUserSubmit: function (user) {
        console.log("Saving User for Choice " + this.props.choiceId + ": ", user);
        
        //If user was found, add the ID to the user data
        if(typeof(this.state.foundUser.id) !== "undefined") {
            user.id = this.state.foundUser.id;
        }
        //If user was looked for and not found, add set the user ID to false
        else if(this.state.foundUser === false) {
            user.id = 0;
        }
        
        //Save the settings
        var url = '../add_user/' + this.props.choiceId;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: user,
            success: function(data) {
                console.log(data.response);
                console.log(data.user);
                
                var currentUsers = this.state.users;    //Get the current users
                currentUsers.push(data.user);   //Add the new user to current users
                
                currentUsers = this.sortUsers(currentUsers, this.state.sortUsersField);
                //Update state with the new users array
                this.setState({
                    users: currentUsers,
                });
                this.handleAddUserDialogClose();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
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

        console.log("Saving settings for Choice " + this.props.choiceId + ": ", settings);
        
        //Save the settings
        var url = '../role_settings/' + this.props.choiceId;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: settings,
            success: function(data) {
                console.log(data.response);
                //Update the state with the updated data, and set 
                var stateData = settings;
                stateData.settingsButton = {
                    disabled: true,
                    label: 'Saved',
                };
                stateData.snackbar = {
                    open: true,
                    message: data.response,
                }
                
                this.setState(stateData);
                console.log('done');
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

    //Check whether user is already associated with this Choice
    handleCheckUserAssociation: function(searchValue) {
        console.log("Checking whether User is associated: ", searchValue);
        
        var userAlreadyAssociated = this.state.users.some(function(user) {
            return user.username === searchValue || user.email === searchValue;
        });
        if(userAlreadyAssociated) {
            this.setState({
                findUserMessage: 'User already associated. [[LINK: Edit their permissions]]',
                foundUser: 'error',
            });
        }
        return userAlreadyAssociated;
    },
    
    //
    handleFilterUsersChange: function(event) {
        console.log("User Role Filter changed");
        console.log(this.state.filterRoles);
        
        var filterRoles = this.state.filterRoles;
        //Get the filtered roles
        var targetSplit = event.target.name.split('.');
        var role = targetSplit[1];
        filterRoles[role] = event.target.checked;
        this.setState({
            filterRoles: filterRoles
        });
        console.log(this.state.filterRoles);
        return false;
    },
    
    handleSortUsersChange: function(currentValues, isChanged) {
        if(isChanged) {
            console.log("User Sort changed to " + currentValues.sort);
            
            currentUsers = this.sortUsers(this.state.users, currentValues.sort);
           
           //Update state with the sorted users array and sortField
            this.setState({
                sortUsersField: currentValues.sort,
                users: currentUsers,
            });
        }
        return false;
    },
    
    //Look up a user in the DB based on their username/email
    handleFindUser: function(searchValue) {
        console.log("Attempting to find User: ", searchValue);
        
        //Look the user up
        var url = '../../users/find_user/' + this.props.choiceId + '/' + searchValue + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            success: function(data) {
                console.log(data);
                    
                var message = 'User found: '
                if(data.user.fullname === null) {
                    message += data.user.username;
                }
                else {
                    message += data.user.fullname;
                    message += ' (';
                    message += data.user.username;
                    if(data.user.email !== null && data.user.username !== data.user.email) {
                        message += ', ' + data.user.email;
                    }
                    message += ')';
                }

                this.setState({
                    findUserMessage: message,
                    foundUser: data.user,
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                this.setState({
                    findUserMessage: 'That user wasn\'t found in Chooser, but you can still give them additional roles. They will have these roles when they first access the Choice.',
                    foundUser: false,
                });
            }.bind(this)
        });
    },
    
    handleRequestClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
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
            change: this.handleAddUserChange,
            checkUserAssociation: this.handleCheckUserAssociation,
            dialogOpen: this.handleAddUserDialogOpen,
            dialogClose: this.handleAddUserDialogClose,
            findUser: this.handleFindUser,
            submit: this.handleAddUserSubmit,
        };
    
        var filterUsersHandlers={
            change: this.handleFilterUsersChange,
        };
    
        var sortUsersHandlers={
            change: this.handleSortUsersChange,
        };
    
        return (
            <div>
                <RolesSettingsForm 
                    state={this.state} 
                    roleOptions={this.props.roleOptions} 
                    handlers={settingsHandlers}
                />
                <UsersTable 
                    choiceId={this.props.choiceId} 
                    state={this.state} 
                    roleOptions={this.props.roleOptions} 
                    addUserHandlers={addUserHandlers}
                    filterUsersHandlers={filterUsersHandlers}
                    sortUsersHandlers={sortUsersHandlers}
                />
                <Snackbar
                    open={this.state.snackbar.open}
                    message={this.state.snackbar.message}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
});

module.exports = RolesContainer;