import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

import Settings from './settings.jsx';
import SettingsEdit from './settings-edit-page.jsx';

var update = require('react-addons-update');

var EditSettingsContainer = React.createClass({
    loadInstanceFromServer: function() {
        var url = 'get-active.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    instance: data.editingInstance,
                    instanceLoaded: true
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {
            action: 'view',
            instance: [],
            instanceLoaded: false,
            snackbar: {
                open: false,
                message: '',
            },
        };
    },
    componentDidMount: function() {
        this.loadInstanceFromServer();
    },
    
    //Handle going back to view screen
    handleBackClick: function() {
        this.setState({
            action: 'view',
        });
    },
    
    handleSettingsEditClick: function() {
        this.setState({
            action: 'edit',
        });
    },
    
    handleSettingsSuccess: function(returnedData) {
        this.setState({
            action: 'view',
            instance: returnedData.instance,
        });
        
        this.handleSnackbarOpen(returnedData.response);
    },
    
    handleSnackbarOpen: function(message) {
        this.setState({
            snackbar: {
                open: true,
                message: message,
            },
        });
    },
    
    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    render: function() {
        var settingsHandlers={
            editButtonClick: this.handleSettingsEditClick,
        };
        var settingsEditHandlers={
            backButtonClick: this.handleBackClick,
            snackbarOpen: this.handleSnackbarOpen,
            success: this.handleSettingsSuccess,
        };

        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={null}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name + ": Editing Settings"} />}
        />;
        
        var snackbar = <Snackbar
            open={this.state.snackbar.open}
            message={this.state.snackbar.message}
            autoHideDuration={3000}
            onRequestClose={this.handleSnackbarClose}
        />;

        if(this.state.action === 'view') {
            return (
                <Container topbar={topbar} title={false}>
                    <Settings
                        handlers={settingsHandlers}
                        instance={this.state.instance}
                        instanceLoaded={this.state.instanceLoaded}
                    />
                    {snackbar}
                </Container>
            );
        }
        else if(this.state.action === 'edit') {
            return (
                <SettingsEdit
                    handlers={settingsEditHandlers}
                    instance={this.state.instance}
                    snackbar={snackbar}
                />
            );
        }
    }
});

module.exports = EditSettingsContainer;