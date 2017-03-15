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
            ruleDeleteDialogOpen: false,
            ruleBeingDeleted: null,
            ruleDeleteButtonEnabled: true,
            ruleDeleteButtonLabel: 'Delete',
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
    
    handleRuleDeleteDialogOpen: function(ruleIndex) {
        this.setState({
            ruleDeleteDialogOpen: true,
            ruleBeingDeleted: ruleIndex,
        });
    },

    handleRuleDeleteDialogClose: function() {
        this.setState({
            ruleDeleteDialogOpen: false,
            ruleBeingDeleted: null,
        });
    },
    
    handleRuleDelete: function(rule) {
        /*this.setState({
            ruleDeleteButtonEnabled: false,
            ruleDeleteButtonLabel: 'Deleting',
        });*/

        var rule = this.state.rules[this.state.ruleBeingDeleted];
        console.log("Deleting rule: ", rule);
        
        //Save the Rule
        var url = '../rules/delete/' + this.props.choice.id + '/' + this.state.instance.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: rule,
            success: function(returnedData) {
                console.log(returnedData.response);

                var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                stateData.ruleDeleteButtonEnabled = true;
                stateData.ruleDeleteButtonLabel = 'Delete';
                stateData.ruleDeleteDialogOpen = false;   //Close the Dialog
                stateData.ruleBeingDeleted = null;
                
                //Update the state instance
                stateData.rules = returnedData.rules;
                stateData.ruleIndexesById = returnedData.ruleIndexesById;
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    ruleSaveButtonEnabled: true,
                    ruleSaveButtonLabel: 'Retry',
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
            }.bind(this)
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
        var settingsHandlers={
            backButtonClick: this.handleBackClick,
            editButtonClick: this.handleSettingsEditClick,
            success: this.handleSettingsSuccess,
            snackbarOpen: this.handleSnackbarOpen,
        };
        var rulesHandlers={
            backButtonClick: this.handleBackClick,
            deleteDialogOpen: this.handleRuleDeleteDialogOpen,
            deleteDialogClose: this.handleRuleDeleteDialogClose,
            delete: this.handleRuleDelete,
            editButtonClick: this.handleRuleEditClick,
            settingsEditButtonClick: this.handleSettingsEditClick,
            success: this.handleRuleSuccess,
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
                        containerState={this.state}
                    />
                    <Rules
                        choice={this.props.choice}
                        handlers={rulesHandlers}
                        containerState={this.state}
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
                    handlers={settingsHandlers}
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
                    handlers={rulesHandlers}
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