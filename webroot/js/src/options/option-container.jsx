import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';

import ChoiceInstructions from './choice-instructions.jsx';
import OptionsTable from './option-table.jsx';

import ChooserTheme from '../elements/theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var OptionContainer = React.createClass({
    loadInstanceFromServer: function() {
        var url = '../../choosing-instances/get-active/' + this.props.choice.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    instance: data.choosingInstance,
                    favourites: data.favourites,
                    instanceLoaded: true,
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    loadOptionsFromServer: function(orderField, orderDirection) {
        var url = '../get-options/' + this.props.choice.id + '/' + this.props.action;
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
    loadRulesFromServer: function() {
        var url = '../../rules/get/' + this.props.choice.id + '/view.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    rules: data.rules,
                    rulesLoaded: true,
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    
    getInitialState: function () {
        var initialState = {
            favourites: [],
            instance: [],
            instanceLoaded: false,
            options: [],
            optionIndexesById: [],
            optionsLoaded: false,
            optionsSelected: [],
            rules: [],
            rulesLoaded: false,
            sortField: 'code',
            sortDirection: 'asc',
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        if(this.props.action === 'edit') {
            initialState.optionBeingEdited = null;
            initialState.optionDialogOpen = false;
            initialState.optionDialogTitle = 'Add Option';
            initialState.optionSaveButtonEnabled = true;
            initialState.optionSaveButtonLabel = 'Save';
        
            if(this.props.choice.use_description) {
                initialState.optionValue_description = '';
            }
            for(var extra in this.props.choice.extra_fields) {
                var field = this.props.choice.extra_fields[extra];
                if(field.type === 'wysiwyg') {
                    initialState['optionValue_' + field.name] = '';
                }
            }
        }

        return initialState;
    },

    componentDidMount: function() {
        this.loadOptionsFromServer();
        if(this.props.action === 'view') {
            this.loadInstanceFromServer();
            this.loadRulesFromServer();
        }
    },
    
    handleFavourite: function(choicesOptionId, action) {
        if(!choicesOptionId || !action) {
            return false;
        }
    
        console.log('add fav ' + choicesOptionId + '; ins: ' + this.state.instance.id);
        
        //Optimistically update the favourites array
        var favourites = this.state.favourites;
        if(action === 'add') {
            var newFavourites = favourites.concat(choicesOptionId);
        }
        else {
            var newFavourites = favourites.filter(function(value) {
                return value !== choicesOptionId;
            });
        }
        this.setState({
            favourites: newFavourites,
        });
        
        //Save the settings
        var url = '../../shortlisted-options/favourite/' + action + '/' + this.state.instance.id + '/' + choicesOptionId;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            //data: {,
            success: function(returnedData) {
                console.log(returnedData.response);
                
                //No further action needed as favourites optimistically updated
            },
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    favourites: favourites, //Revert to the previous favourites
                    //Show error in snackbar
                    snackbar: {
                        open: true,
                        message: 'Error adding favourite (' + err.toString() + ')',
                    }
                });
            }.bind(this)
        });
        
    },
    
    handleOptionSelect: function(rowsSeleted) {
        console.log(rowsSeleted);
        var optionsSelected = [];
        if(rowsSeleted === 'all') {
            this.state.options.map(function(option) {
                optionsSelected.push(option.id);
            }, this);
        }
        else if(rowsSeleted === 'none') {
            //Leave optionsSelected empty
        }
        else {
            rowsSeleted.map(function(rowIndex) {
                optionsSelected.push(this.state.options[rowIndex].id);
            }, this);
        }
        
        console.log(optionsSelected);
        this.setState({optionsSelected: optionsSelected});
    },
    
    handleOptionChange: function() {
    
    },
    
    handleOptionDialogOpen: function(optionId) {
        var stateData = {
            optionDialogOpen: true,    //Open the dialog
        };
        
        //If no option is specified, a new option is being added so set optionBeingEdited to null
        if(optionId) {
            console.log("Editing option: ", optionId);
            stateData.optionDialogTitle = 'Edit Option';
            stateData.optionBeingEdited = optionId;
            
            //Get the WYSIWYG field values
            if(optionId && this.props.choice.use_description) {
                stateData.optionValue_description = this.state.options[this.state.optionIndexesById[optionId]].description;
            }
            else {
                stateData.optionValue_description = '';
            }
            for(var extra in this.props.choice.extra_fields) {
                var field = this.props.choice.extra_fields[extra];
                if(field.type === 'wysiwyg') {
                    stateData['optionValue_' + field.name] = this.state.options[this.state.optionIndexesById[optionId]][field.name];
                }
            }
        }
        else {
            console.log("Adding option");
            stateData.optionDialogTitle = 'Add Option';
            stateData.optionBeingEdited = null;
        }
        
        this.setState(stateData);
    },
    
    handleOptionDialogClose: function() {
        this.setState({
            optionBeingEdited: null,    //Clear the option being edited
            optionDialogOpen: false,    //Close the dialog
        });
    },
    
    //Submit the add option form
    handleOptionSubmit: function (option) {
        this.setState({
            optionSaveButtonEnabled: false,
            optionSaveButtonLabel: 'Saving',
        });

        //Get the alloy editor data
        if(this.props.choice.use_description) {
            option.description = this.state.optionValue_description;
        }
        for(var extra in this.props.choice.extra_fields) {
            var field = this.props.choice.extra_fields[extra];
            if(field.type === 'wysiwyg') {
                option[field.name] = this.state['optionValue_' + field.name];
            }
        }
        
        if(this.state.optionBeingEdited) {
            option.choices_option_id = this.state.optionBeingEdited;
        }
        
        console.log("Saving option: ", option);
        
        //Save the settings
        var url = '../save/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: option,
            success: function(returnedData) {
                console.log(returnedData.response);

                var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                stateData.optionSaveButtonEnabled = true;
                stateData.optionSaveButtonLabel = 'Save';
                stateData.optionDialogOpen = false;   //Close the Dialog
                
                //Update the state options list
                stateData.options = this.state.options;    //Get the current options
                
                //If editing an option, replace the old option with the new one
                if(this.state.optionBeingEdited) {
                    stateData.options.splice(this.state.optionIndexesById[returnedData.option.id], 1, returnedData.option);   //Replace the field in current extraFields
                
                }
                //If adding an option, add the new option to the enf of the list
                else {
                    stateData.options.push(returnedData.option);   //Add the new option to current options
                }
                
                //Update the optionIndexesById in state
                this.updateOptionIndexesById(stateData.options);
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    optionSaveButtonEnabled: true,
                    optionSaveButtonLabel: 'Resave',
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
            }.bind(this)
        });
    },

    handleOptionWysiwygChange: function(element, value) {
        var stateData = {};
        stateData['optionValue_' + element] = value;
        this.setState(stateData);
        
        this.handleOptionChange();
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
                    //Checkbox options should be in alphabetical order, so can concatenate the selected values for each option then compare
                    var valueA = '';
                    for(var value in a[field]) {
                        if(a[field][value]) {
                            valueA += value.toUpperCase();
                        }
                    }
                    var valueB = '';
                    for(var value in b[field]) {
                        if(b[field][value]) {
                            valueB += value.toUpperCase();
                        }
                    }
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
        var containerHandlers = {
            sort: this.handleSort,
            selectOption: this.handleOptionSelect,
        };
    
        if(this.props.action === 'view') {
            containerHandlers.favourite = this.handleFavourite;
        }
        else if(this.props.action === 'edit') {
            containerHandlers.change = this.handleOptionChange;
            containerHandlers.submit = this.handleOptionSubmit;
            containerHandlers.dialogOpen = this.handleOptionDialogOpen;
            containerHandlers.dialogClose = this.handleOptionDialogClose;
            containerHandlers.wysiwygChange = this.handleWysiwygChange;
        }
        
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    {(this.props.action === 'view')?
                        <ChoiceInstructions
                            containerState={this.state}
                            choice={this.props.choice}
                        />
                    :""}
                    <OptionsTable
                        action={this.props.action}
                        containerState={this.state}
                        choice={this.props.choice}
                        optionContainerHandlers={containerHandlers}
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

module.exports = OptionContainer;