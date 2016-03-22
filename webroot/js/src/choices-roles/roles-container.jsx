var React = require('react');
var RolesSettingsForm = require('./roles-settings.jsx');
var UsersTable = require('./users-table.jsx');
var Snackbar = require('material-ui/lib/snackbar');

var RolesContainer = React.createClass({
    getInitialState: function () {
        return {
            defaultRoles: this.props.initialDefaultRoles,
            notify: this.props.initialNotify,
            users: this.props.initialUsers,
            settingsButton: {
                disabled: true,
                label: 'Saved',
            },
            snackbar: {
                open: false,
                message: '',
            },
            userDialogOpen: false,
        };
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

    //Submit the user form
    handleUserSubmit: function (user) {
        console.log("Saving User for Choice " + this.props.choiceId + ": ", user);
        
        //Save the settings
        var url = '../add_user/' + this.props.choiceId;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: user,
            success: function(data) {
                console.log(data.response);
                
                //TODO: Add user to state.users
                this.handleUserDialogClose();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
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

    handleUserDialogOpen: function() {
        this.setState({
            userDialogOpen: true,
        });
    },

    handleUserDialogClose: function() {
        this.setState({
            userDialogOpen: false,
        });
    },

    render: function() {
        return (
            <div>
                <RolesSettingsForm 
                    state={this.state} 
                    roleOptions={this.props.roleOptions} 
                    onSettingsSubmit={this.handleSettingsSubmit}
                    onSettingsChange={this.handleSettingsChange}
                />
                <br />
                <UsersTable 
                    choiceId={this.props.choiceId} 
                    state={this.state} 
                    roleOptions={this.props.roleOptions} 
                    onUserSubmit={this.handleUserSubmit}
                    onUserDialogOpen={this.handleUserDialogOpen}
                    onUserDialogClose={this.handleUserDialogClose}
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