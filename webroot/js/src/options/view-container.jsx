import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';

import ChoiceInstructions from './choice-instructions.jsx';
import OptionsTable from './option-table.jsx';

import ChooserTheme from '../elements/theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var ViewContainer = React.createClass({
    loadInstanceFromServer: function() {
        var url = '../../choosing-instances/get-active/' + this.props.choice.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    instance: data.choosingInstance,
                    instanceLoaded: true,
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    loadOptionsFromServer: function(orderField, orderDirection) {
        var url = '../get-options/' + this.props.choice.id + '/view';
        if(typeof(orderField) !== "undefined") {
            url += '/' + orderField;
            if(typeof(orderDirection) !== "undefined") {
                url += '/' + orderDirection;
            }
            else {
                url += '/asc';
            }
        }
        url += '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    options: data.options,
                    optionIndexesById: data.optionIndexesById,
                    optionsLoaded: true,
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        var initialState = {
            instance: [],
            instanceLoaded: false,
            options: [],
            optionIndexesById: [],
            optionsLoaded: false,
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        return initialState;
    },
    componentDidMount: function() {
        this.loadOptionsFromServer();
        this.loadInstanceFromServer();
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
                        containerState={this.state}
                        choice={this.props.choice}
                    />
                    <OptionsTable
                        action={'view'}
                        containerState={this.state}
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