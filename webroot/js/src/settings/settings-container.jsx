import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

import Settings from './settings.jsx';
import Rules from './rules.jsx';
import SettingsEdit from './settings-edit-page.jsx';
import RuleEdit from './rule-edit-page.jsx';

var update = require('react-addons-update');

var ruleDefaults = {
    type: 'number',
    valueType: 'range',
    combinedType: 'number_range',
    scope: 'choice',
    categoryFieldIndex: null,
    categoryFieldOptionValue: null,
};

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
                        ruleIndexesById: data.ruleIndexesById,
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
            ruleIndexesById: [],
            ruleCategoryFields: [],
            ruleBeingEdited: null,
            snackbar: {
                open: false,
                message: '',
            },
        };
    },
    componentDidMount: function() {
        this.loadInstanceFromServer();
        //this.loadRulesFromServer();
    },
    
    //Handle going back to view screen
    handleBackClick: function() {
        this.setState({
            action: 'view',
        });
    },
    
    handleRuleEditClick: function(ruleIndex) {
        this.setState({
            action: 'rule',
            ruleBeingEdited: (typeof(ruleIndex) !== "undefined"?this.state.rules[ruleIndex].id:null),
        });
    },
    
    handleRuleSuccess: function(returnedData) {
        this.setState({
            action: 'view',
            ruleBeingEdited: null,
            ruleIndexesById: returnedData.ruleIndexesById,
            rules: returnedData.rules,
        });

        this.handleSnackbarOpen(returnedData.response);
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
        var rulesHandlers={
            editButtonClick: this.handleRuleEditClick,
            settingsEditButtonClick: this.handleSettingsEditClick,
            snackbarOpen: this.handleSnackbarOpen,
            success: this.handleRuleSuccess,
        };
        var ruleEditHandlers={
            backButtonClick: this.handleBackClick,
            snackbarOpen: this.handleSnackbarOpen,
            success: this.handleRuleSuccess,
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
                        choice={this.props.choice}
                        handlers={settingsHandlers}
                        instance={this.state.instance}
                        instanceLoaded={this.state.instanceLoaded}
                    />
                    <Rules
                        choice={this.props.choice}
                        handlers={rulesHandlers}
                        instance={this.state.instance}
                        instanceLoaded={this.state.instanceLoaded}
                        rules={this.state.rules}
                    />
                    {snackbar}
                </Container>
            );
        }
        else if(this.state.action === 'edit') {
            return (
                <SettingsEdit
                    choice={this.props.choice}
                    dashboardUrl={this.props.dashboardUrl} 
                    handlers={settingsEditHandlers}
                    instance={this.state.instance}
                    sections={this.props.sections} 
                    snackbar={snackbar}
                />
            );
        }
        else if(this.state.action === 'rule') {
            return (
                <RuleEdit
                    choice={this.props.choice}
                    dashboardUrl={this.props.dashboardUrl} 
                    handlers={ruleEditHandlers}
                    instance={this.state.instance}
                    rules={this.state.rules}
                    ruleCategoryFields={this.state.ruleCategoryFields}
                    ruleIndexesById={this.state.ruleIndexesById}
                    ruleBeingEdited={this.state.ruleBeingEdited}
                    sections={this.props.sections} 
                    snackbar={snackbar}
                />
            );
        }
    }
});

module.exports = SettingsContainer;