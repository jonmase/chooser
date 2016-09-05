import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import Settings from './settings.jsx';
import Rules from './rules.jsx';

import ChooserTheme from '../theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var FormContainer = React.createClass({
    getInitialState: function () {
        //Open dialog straight away if there is no current instance
        var settingsDialogOpen = this.props.instance.id?false:true;
        
        return {
            instance: this.props.instance,
            settingsDialogOpen: settingsDialogOpen,
            settingsSaveButtonEnabled: true,
            settingsSaveButtonLabel: 'Save',
            snackbar: {
                open: false,
                message: '',
            },
            wysiwygValue_choosing_instructions: this.props.instance.choosing_instructions || '',
            wysiwygValue_preference_instructions: this.props.instance.preference_instructions || '',
            wysiwygValue_comments_overall_instructions: this.props.instance.comments_overall_instructions || '',
            wysiwygValue_comments_per_option_instructions: this.props.instance.comments_per_option_instructions || '',
        };
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
        settings.choosing_instructions = this.state.wysiwygValue_choosing_instructions;
        settings.preference_instructions = this.state.wysiwygValue_preference_instructions;
        settings.comments_overall_instructions = this.state.wysiwygValue_comments_overall_instructions;
        settings.comments_per_option_instructions = this.state.wysiwygValue_comments_per_option_instructions;
        
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
    
    handleWysiwygChange: function(element, value) {
        var stateData = {};
        stateData['wysiwygValue_' + element] = value;
        this.setState(stateData);
    },
    
    render: function() {
        var settingsHandlers={
            dialogOpen: this.handleSettingsDialogOpen,
            dialogClose: this.handleSettingsDialogClose,
            submit: this.handleSettingsSubmit,
            wysiwygChange: this.handleWysiwygChange,
        };
        var rulesHandlers={
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