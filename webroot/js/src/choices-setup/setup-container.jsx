import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import Settings from './settings.jsx';
import Rules from './rules.jsx';

import ChooserTheme from '../theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var update = require('react-addons-update');

var FormContainer = React.createClass({
    loadInstanceFromServer: function() {
        var url = '../getActive/' + this.props.choice.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    instance: data.choosingInstance,
                    instanceLoaded: true,
                    settingsToggle_preference: data.choosingInstance.preference,
                    settingsToggle_comments_overall: data.choosingInstance.comments_overall,
                    settingsToggle_comments_per_option: data.choosingInstance.comments_per_option,
                    settingsWysiwyg_choosing_instructions: data.choosingInstance.choosing_instructions,
                    settingsWysiwyg_preference_instructions: data.choosingInstance.preference_instructions,
                    settingsWysiwyg_comments_overall_instructions: data.choosingInstance.comments_overall_instructions,
                    settingsWysiwyg_comments_per_option_instructions: data.choosingInstance.comments_per_option_instructions,
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        //Open dialog straight away if there is no current instance
        //var settingsDialogOpen = this.props.instance.id?false:true;
        var settingsDialogOpen = false;
        
        return {
            instance: [],//this.props.instance,
            instanceLoaded: false,
            rules: [],//this.props.rules,
            //ruleCategoryFields: this.props.ruleCategoryFields,
            ruleDialogOpen: settingsDialogOpen,
            ruleSaveButtonEnabled: true,
            ruleSaveButtonLabel: 'Save',
            settingsDialogOpen: settingsDialogOpen,
            settingsSaveButtonEnabled: true,
            settingsSaveButtonLabel: 'Save',
            settingsToggle_preference: false,
            settingsToggle_comments_overall: false,
            settingsToggle_comments_per_option: false,
            settingsWysiwyg_choosing_instructions: '',
            settingsWysiwyg_preference_instructions: '',
            settingsWysiwyg_comments_overall_instructions: '',
            settingsWysiwyg_comments_per_option_instructions: '',
            snackbar: {
                open: false,
                message: '',
            },
            //wysiwygValue_rule_instructions: '',
        };
    },
    componentDidMount: function() {
        this.loadInstanceFromServer();
        //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    handleRuleDialogOpen: function(event) {
        this.setState({
            ruleDialogOpen: true,
        });
    },

    handleRuleDialogClose: function() {
        this.setState({
            ruleDialogOpen: false,
        });
    },

    handleRuleSubmit: function(rule) {
        this.setState({
            ruleSaveButtonEnabled: false,
            ruleSaveButtonLabel: 'Saving',
        });

        //Get the wysiwyg editor data
        rule.instructions = this.state.wysiwygValue_rule_instructions;
        
        console.log("Saving rule: ", rule);
        
        //Save the Rule
        //var url = '../../rules/save/' + this.props.choice.id;
        var url = '../saverule/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: rule,
            success: function(returnedData) {
                console.log(returnedData.response);

                /*var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                stateData.settingsSaveButtonEnabled = true;
                stateData.settingsSaveButtonLabel = 'Save';
                stateData.settingsDialogOpen = false;   //Close the Dialog
                
                //Update the state instance
                //stateData.instance = returnedData.instance;
                
                this.setState(stateData);*/
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                /*this.setState({
                    settingsSaveButtonEnabled: true,
                    settingsSaveButtonLabel: 'Resave',
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });*/
            }.bind(this)
        });
    },

    handleSettingsDialogOpen: function(event) {
        this.setState({
            settingsDialogOpen: true,
        });
    },

    handleSettingsDialogClose: function() {
        this.setState({
            settingsDialogOpen: false,
        });
    },

    handleSettingsSubmit: function(settings) {
        this.setState({
            settingsSaveButtonEnabled: false,
            settingsSaveButtonLabel: 'Saving',
        });

        //Get the wysiwyg editor data
        settings.choosing_instructions = this.state.settingsWysiwyg_choosing_instructions;
        settings.preference_instructions = this.state.settingsWysiwyg_preference_instructions;
        settings.comments_overall_instructions = this.state.settingsWysiwyg_comments_overall_instructions;
        settings.comments_per_option_instructions = this.state.settingsWysiwyg_comments_per_option_instructions;
        
        console.log("Saving settings: ", settings);
        
        //Save the settings
        var url = '../save/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: settings,
            success: function(returnedData) {
                console.log(returnedData.response);

                var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                stateData.settingsSaveButtonEnabled = true;
                stateData.settingsSaveButtonLabel = 'Save';
                stateData.settingsDialogOpen = false;   //Close the Dialog
                
                //Update the state instance
                stateData.instance = returnedData.instance;
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    settingsSaveButtonEnabled: true,
                    settingsSaveButtonLabel: 'Resave',
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
            }.bind(this)
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
    
    handleSettingsToggleChange: function(event, value) {
        var stateData = {};
        stateData['settingsToggle_' + event.target.name] = value;
        this.setState(stateData);
    },

    handleSettingsWysiwygChange: function(element, value) {
        var stateData = {};
        stateData['settingsWysiwyg_' + element] = value;
        this.setState(stateData);
    },
    
    handleRuleWysiwygChange: function(element, value) {
        var stateData = {};
        stateData['wysiwygValue_rule_instructions'] = value;
        this.setState(stateData);
    },
    
    render: function() {
        var settingsHandlers={
            dialogOpen: this.handleSettingsDialogOpen,
            dialogClose: this.handleSettingsDialogClose,
            handleToggleChange: this.handleSettingsToggleChange,
            submit: this.handleSettingsSubmit,
            handleWysiwygChange: this.handleSettingsWysiwygChange,
        };
        var rulesHandlers={
            dialogOpen: this.handleRuleDialogOpen,
            dialogClose: this.handleRuleDialogClose,
            submit: this.handleRuleSubmit,
            wysiwygChange: this.handleRuleWysiwygChange,
        };

        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <p>Provide instructions, deadlines, rules, etc for students to make their choices.</p>
                    <Settings
                        choice={this.props.choice}
                        handlers={settingsHandlers}
                        state={this.state}
                    />
                    <Rules
                        choice={this.props.choice}
                        handlers={rulesHandlers}
                        state={this.state}
                    />
                    <Snackbar
                        open={this.state.snackbar.open}
                        message={this.state.snackbar.message}
                        autoHideDuration={3000}
                        onRequestClose={this.handleSnackbarClose}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
});

module.exports = FormContainer;