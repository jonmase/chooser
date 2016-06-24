import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';

import ChooserTheme from '../theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var IndexContainer = React.createClass({
    getInitialState: function () {
        return {
            snackbar: {
                open: false,
                message: '',
            },
        };
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
        /*var defaultsHandlers={
            change: this.handleDefaultsChange,
            submit: this.handleDefaultsSubmit,
        };*/
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
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