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
            snackbar: {
                open: false,
                message: '',
            },
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

    handleSettingsSubmit: function() {
        console.log('submit settings');
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
            dialogOpen: this.handleSettingsDialogOpen,
            dialogClose: this.handleSettingsDialogClose,
            submit: this.handleSettingsSubmit,
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