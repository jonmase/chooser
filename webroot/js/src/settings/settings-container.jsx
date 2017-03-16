import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

import Settings from './settings.jsx';
import Rules from './rules.jsx';
import SettingsEdit from './settings-edit-page.jsx';
import RuleEdit from './rule-edit-page.jsx';
import RuleView from './rule-view-page.jsx';

var update = require('react-addons-update');

var SettingsContainer = React.createClass({
    loadInstanceFromServer: function() {
        var url = 'get-active/settings.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    instance: data.choosingInstance,
                    instanceLoaded: true
                });
                
                //If there is a choosing instance, update the remaining state values
                if(data.choosingInstance.id) {
                    this.setState({
                        rules: data.rules,
                        ruleCategoryFields: data.ruleCategoryFields,
                    });
                }
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
            rules: [],
            ruleCategoryFields: [],
            ruleBeingEdited: null,
            ruleBeingViewed: null,
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
    
    handleRuleEditClick: function(ruleIndex) {
        this.setState({
            action: 'rule-edit',
            ruleBeingEdited: (typeof(ruleIndex) !== "undefined"?ruleIndex:null),
        });
    },
    
    handleRuleSuccess: function(returnedData) {
        this.setState({
            action: 'view',
            ruleBeingEdited: null,
            rules: returnedData.rules,
        });

        this.handleSnackbarOpen(returnedData.response);
    },

    handleRuleViewClick: function(ruleIndex) {
        //Check that a rule index has been passed
        if(typeof(ruleIndex) !== "undefined") {
            this.setState({
                action: 'rule-view',
                ruleBeingViewed: ruleIndex,
            });
        }
        //Otherwise, do nothing
        else {
            console.log("No rule specified to view");
            return false;
        }
    },
    
    handleSettingsEditClick: function() {
        this.setState({
            action: 'settings-edit',
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
        var rulesHandlers={
            editButtonClick: this.handleRuleEditClick,
            settingsEditButtonClick: this.handleSettingsEditClick,
            snackbarOpen: this.handleSnackbarOpen,
            success: this.handleRuleSuccess,
            viewButtonClick: this.handleRuleViewClick,
        };
        var ruleEditHandlers={
            backButtonClick: this.handleBackClick,
            snackbarOpen: this.handleSnackbarOpen,
            success: this.handleRuleSuccess,
        };
        var ruleViewHandlers={
            backButtonClick: this.handleBackClick,
            editButtonClick: this.handleRuleEditClick,
        };
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
            title={<AppTitle subtitle={this.props.choice.name + ": Choice Settings"} />}
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
                    <Rules
                        handlers={rulesHandlers}
                        instance={this.state.instance}
                        instanceLoaded={this.state.instanceLoaded}
                        rules={this.state.rules}
                    />
                    {snackbar}
                </Container>
            );
        }
        else if(this.state.action === 'settings-edit') {
            return (
                <SettingsEdit
                    handlers={settingsEditHandlers}
                    instance={this.state.instance}
                    snackbar={snackbar}
                />
            );
        }
        else if(this.state.action === 'rule-edit') {
            return (
                <RuleEdit
                    handlers={ruleEditHandlers}
                    instance={this.state.instance}
                    rules={this.state.rules}
                    ruleCategoryFields={this.state.ruleCategoryFields}
                    ruleBeingEdited={this.state.ruleBeingEdited}
                    snackbar={snackbar}
                />
            );
        }
        else if(this.state.action === 'rule-view') {
            return (
                <RuleView
                    handlers={ruleViewHandlers}
                    ruleBeingViewed={this.state.ruleBeingViewed}
                    rules={this.state.rules}
                />
            );
        }
    }
});

module.exports = SettingsContainer;