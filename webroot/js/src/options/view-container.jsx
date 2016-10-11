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
            sortField: 'code',
            sortDirection: 'asc',
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
    
    handleSort: function(field, fieldType) {
        var sortDirection = 'asc';
        if(field === this.state.sortField) {
            if(this.state.sortDirection === 'asc') {
                sortDirection = 'desc';
            }
        }
    
        console.log("sort " + sortDirection + " by " + field);
        
        var stateData = {
            sortDirection: sortDirection,
            sortField: field
        };
        
        stateData.options = this.deepCopy(this.state.options);
        
        stateData.options.sort(
            function(a, b) {
                var textTypes = ['text', 'wysiwyg', 'list', 'email', 'url'];
            
                //TODO: Deal with list types better 
                if(fieldType === 'date') {
                    if(a[field]) {
                        var dateA = a[field].date;
                        var valueA = new Date(parseInt(dateA.year), parseInt(dateA.month), parseInt(dateA.day));
                    }
                    else {
                        valueA = null;
                    }
                    if(b[field]) {
                        var dateB = b[field].date;
                        var valueB = new Date(parseInt(dateB.year), parseInt(dateB.month), parseInt(dateB.day));
                    }
                    else {
                        valueB = null;
                    }
                }
                else if(fieldType === 'datetime') {
                    if(a[field]) {
                        var dateA = a[field].date;
                        var timeA = a[field].time;
                        var valueA = new Date(parseInt(dateA.year), parseInt(dateA.month), parseInt(dateA.day), parseInt(timeA.hour), parseInt(timeA.minute), 0);
                    }
                    else {
                        valueA = null;
                    }
                    if(b[field]) {
                        var dateB = b[field].date;
                        var timeB = b[field].time;
                        var valueB = new Date(parseInt(dateB.year), parseInt(dateB.month), parseInt(dateB.day), parseInt(timeB.hour), parseInt(timeB.minute), 0);
                    }
                    else {
                        valueB = null;
                    }
                }
                else if(fieldType === 'number') {
                    var valueA = a[field];
                    var valueB = b[field];
                }
                else if(fieldType === 'checkbox') {
                    var valueA = a[field];
                    var valueB = b[field];
                }
                //if(textTypes.indexOf(fieldType) > -1) {
                else {  //Otherwise, assume text search
                    var valueA = a[field].toUpperCase(); // ignore upper and lowercase
                    var valueB = b[field].toUpperCase(); // ignore upper and lowercase
                }
                
                
                if (valueA < valueB) {
                    return (sortDirection === 'asc')?-1:1;
                }
                if (valueA > valueB) {
                    return (sortDirection === 'asc')?1:-1;
                }

                // values must be equal
                return 0;
            }
        );
        
        this.updateOptionIndexesById(stateData.options);
        
        this.setState(stateData);
    },
    
    deepCopy: function(o) {
        var copy = o,k;
     
        if (o && typeof o === 'object') {
            copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
            for (k in o) {
                copy[k] = this.deepCopy(o[k]);
            }
        }
     
        return copy;
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
                        sortHandler={this.handleSort}
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