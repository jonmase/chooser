import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';

import OptionsTable from './options-table.jsx';

import ChooserTheme from '../theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var IndexContainer = React.createClass({
    getInitialState: function () {
        return {
            addOptionDialogOpen: false,
            snackbar: {
                open: false,
                message: '',
            },
        };
    },
    
    handleAddChange: function() {
    
    },
    
    handleAddDialogOpen: function() {
        this.setState({
            addOptionDialogOpen: true,
        });
    },
    
    handleAddDialogClose: function() {
        this.setState({
            addOptionDialogOpen: false,
        });
    },
    
    handleAddSubmit: function() {
    
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
        var addHandlers = {
            change: this.handleAddChange,
            submit: this.handleAddSubmit,
            dialogOpen: this.handleAddDialogOpen,
            dialogClose: this.handleAddDialogClose,
        };
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <OptionsTable
                        state={this.state}
                        choice={this.props.choice}
                        addHandlers={addHandlers}
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

module.exports = IndexContainer;