import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';

import OptionsTable from './options-table.jsx';

import ChooserTheme from '../theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var ViewContainer = React.createClass({
    getInitialState: function () {
        var initialState = {
            options: this.props.options,
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        return initialState;
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
        var optionHandlers = {
        };
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <OptionsTable
                        state={this.state}
                        choice={this.props.choice}
                        optionHandlers={optionHandlers}
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

module.exports = ViewContainer;