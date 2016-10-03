import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';

import ChoiceInstructions from './choice-instructions.jsx';
import OptionsTable from './option-table.jsx';

import ChooserTheme from '../elements/theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var ViewContainer = React.createClass({
    getInitialState: function () {
        var initialState = {
            options: this.props.options,
            optionIndexesById: this.props.optionIds,
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        return initialState;
    },
    
    handleAddFavourite: function() {
    
    },
    
    handleRemoveFavourite: function() {
    
    },
    
    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    updateOptionIndexesById: function(options) {
        var optionIndexesById = {};
        options.forEach(function(option, index) {
            optionIndexesById[option.id] = index;
        });
        
        this.setState({
            optionIndexesById: optionIndexesById,
        });
        //return optionIndexesById;
    },

    render: function() {
        var optionHandlers = {
        };
        
        var optionViewHandlers = {
            addFavourite: this.handleAddFavourite,
            removeFavourite: this.handleRemoveFavourite,
        };
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <ChoiceInstructions
                        state={this.state}
                        choice={this.props.choice}
                        instance={this.props.instance}
                    />
                    <OptionsTable
                        action={'view'}
                        instance={this.props.instance}
                        state={this.state}
                        choice={this.props.choice}
                        optionViewHandlers={optionViewHandlers}
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