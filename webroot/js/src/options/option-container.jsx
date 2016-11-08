import React from 'react';
import update from 'immutability-helper';

import Snackbar from 'material-ui/Snackbar';

import Instructions from './choice-instructions.jsx';
import Basket from './selection-basket.jsx';
import OptionsTable from './option-table.jsx';
import Confirm from './selection-confirm.jsx';
import Review from './selection-review.jsx';

import ChooserTheme from '../elements/theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var optionEditingDefaults = {
    optionBeingEdited: null,
    dialogOpen: false,
    dialogTitle: 'Add Option',
};
var optionSaveButtonDefaults = {
    enabled: true,
    label: 'Save',
};


var OptionContainer = React.createClass({
    loadInstanceFromServer: function() {
        var url = '../../choosing-instances/get-active/' + this.props.choice.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    favourites: data.favourites,
                    instance: {
                        instance: data.choosingInstance,
                        loaded: true,
                    },
                    rules: {
                        rules: data.rules,
                        indexesById: data.ruleIndexesById,
                    },
                    selection: {
                        allowSubmit: data.allowSubmit,
                        optionsSelected: data.selected,
                        //optionsSelectedOrdered: data.selectedOrdered,
                        ruleWarnings: data.ruleWarnings,
                        selection: data.selection,
                    },
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    loadOptionsFromServer: function() {
        var url = '../get-options/' + this.props.choice.id + '/' + this.state.action;
        url += '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    options: {
                        options: data.options,
                        indexesById: data.optionIndexesById,
                        loaded: true,
                    },
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    
    getInitialState: function () {
        var initialState = {
            action: this.props.action,
            confirmDialogOpen: false,
            favourites: [],
            instance: {
                instance: [],
                loaded: false,
            },
            options: {
                options: [],
                indexesById: [],
                loaded: false,
            },
            optionsSort: {
                field: 'code',
                fieldType: 'text',
                direction: 'asc',
            },
            rules: {
                rules: [],
                indexesById: [],
            },
            selection: {
                allowSubmit: false,
                optionsSelected: [],
                //optionsSelectedOrdered: [],
                ruleWarnings: false,
                selection: [],
            },
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        if(this.props.action === 'edit') {
            initialState.optionEditing = optionEditingDefaults;
            initialState.optionSaveButton = optionSaveButtonDefaults;
        
            var optionValuesState = {};
            if(this.props.choice.use_description) {
                optionValuesState.value_description = '';
            }
            for(var extra in this.props.choice.extra_fields) {
                var field = this.props.choice.extra_fields[extra];
                if(field.type === 'wysiwyg') {
                    optionValuesState['value_' + field.name] = '';
                }
            }
            initialState.optionValues = optionValuesState;
        }

        return initialState;
    },

    componentDidMount: function() {
        this.loadOptionsFromServer();
        if(this.state.action !== 'edit') {
            this.loadInstanceFromServer();
            //this.loadRulesFromServer();
        }
    },
    
    handleFavourite: function(choicesOptionId, action) {
        if(!choicesOptionId || !action) {
            return false;
        }
    
        console.log('add fav ' + choicesOptionId + '; ins: ' + this.state.instance.instance.id);
        
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
        var url = '../../shortlisted-options/favourite/' + action + '/' + this.state.instance.instance.id + '/' + choicesOptionId;
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
    
    handleOptionChange: function() {
    
    },
    
    handleOptionDialogOpen: function(optionId) {
        //If no option is specified, a new option is being added so set optionBeingEdited to null
        if(optionId) {
            console.log("Editing option: ", optionId);
            
            var optionEditingState = {
                dialogOpen: true,
                dialogTitle: 'Edit Option',
                optionBeingEdited: optionId,
            };
            
            //Update the WYSIWYG field values
            if(optionId && this.props.choice.use_description) {
                var description = this.state.options.options[this.state.options.indexesById[optionId]].description;
            }
            else {
                var description = '';
            }
            
            var optionValuesState = this.state.optionValues;
            var newOptionValuesState = update(optionValuesState, {
                value_description: {$set: description},
            });

            for(var extra in this.props.choice.extra_fields) {
                var field = this.props.choice.extra_fields[extra];
                if(field.type === 'wysiwyg') {
                    var value = this.state.options.options[this.state.options.indexesById[optionId]][field.name];
                    //stateData['optionValue_' + field.name] = value;
                    var newOptionValuesState = update(newOptionValuesState, {['optionValue_' + field.name]: {$set: value}});
                }
            }
            this.setState({optionValues: newOptionValuesState});
        }
        else {
            console.log("Adding option");
            var optionEditingState = {
                dialogOpen: true,
                dialogTitle: 'Add Option',
                optionBeingEdited: null,
            };
        }
        
        this.setState({optionEditing: optionEditingState});
    },
    
    handleOptionDialogClose: function() {
        var optionEditingState = {
            dialogOpen: false,
            dialogTitle: 'Add Option',
            optionBeingEdited: null,
        };
        this.setState({optionEditing: optionEditingState});
    },
    
    handleOptionEditSelect: function(rowsSeleted) {
    },
    
    //Submit the add option form
    handleOptionSubmit: function (option) {
        this.setState({
            optionSaveButton: {
                enabled: false,
                label: 'Saving',
            },
        });

        //Get the alloy editor data
        if(this.props.choice.use_description) {
            option.description = this.state.optionValues.value_description;
        }
        for(var extra in this.props.choice.extra_fields) {
            var field = this.props.choice.extra_fields[extra];
            if(field.type === 'wysiwyg') {
                option[field.name] = this.state.optionValues['value_' + field.name];
            }
        }
        
        if(this.state.optionEditing.optionBeingEdited) {
            option.choices_option_id = this.state.optionEditing.optionBeingEdited;
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

                var unsortedOptions = returnedData.options;
                
                var sortedOptions = this.sortOptions(unsortedOptions, this.state.optionsSort.field, this.state.optionsSort.fieldType, this.state.optionsSort.direction);
                
                this.setState({
                    optionEditing: optionEditingDefaults,
                    options: {
                        options: sortedOptions,
                        indexesById: this.updateOptionIndexesById(sortedOptions),
                        loaded: true,
                    },
                    optionSaveButton: optionSaveButtonDefaults,
                    snackbar: {
                        open: true,
                        message: returnedData.response,
                    },
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    optionSaveButton: {
                        enabled: true,
                        label: 'Resave',
                    },
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
            }.bind(this)
        });
    },

    handleOptionWysiwygChange: function(element, value) {
        var optionValuesState = this.state.optionValues;
        var newOptionValuesState = update(optionValuesState, {
            ['value_' + element]: {$set: value},
        });
        this.setState({optionValues: newOptionValuesState});
        
        this.handleOptionChange();
    },
    
    handleOptionRemove: function(optionId) {
        console.log("remove option: " + optionId);
        
        var optionsSelected = this.state.selection.optionsSelected.splice(0);
        optionsSelected.splice(optionsSelected.findIndex(function(element) { return element === optionId }), 1);
        
        this.saveSelectedOptions(optionsSelected);
    },
    
    handleOptionSelect: function(rowsSeleted) {
        //console.log(rowsSeleted);
        var previousOptionsSelected = this.state.selection.optionsSelected;
        var optionsSelected = [];
        if(rowsSeleted === 'all') {
            this.state.options.options.map(function(option) {
                optionsSelected.push(option.id);
            }, this);
        }
        else if(rowsSeleted === 'none') {
            //Leave optionsSelected empty
        }
        else {
            rowsSeleted.map(function(rowIndex) {
                optionsSelected.push(this.state.options.options[rowIndex].id);
            }, this);
        }
        
        this.saveSelectedOptions(optionsSelected);
    },
    
    handleSelectionBackToEdit() {
        this.setState({
            action: 'view'
        });
    },
    
    handleSelectionSubmit() {
        console.log("selection submitted");
        //Don't actually need to do anything at this stage, just change to confirm view
        this.setState({
            action: 'confirm'
        });
    },
    
    handleSelectionFinalConfirm(data) {
        console.log("selection finally submitted");
     
        //TODO: In DB, change selection status to confirmed and save preferences and comments
        //Save the selection
        data.selection.confirmed = true,
        
        this.saveSelection(data, 'confirm');
    },
    
    saveSelectedOptions: function(optionsSelected) {
        //Prevent submitting while request is sent
        var selectionState = this.state.selection;
        var newSelectionState = update(selectionState, {allowSubmit: {$set: false}});
        this.setState({
            selection: newSelectionState,
        });

        console.log(optionsSelected);
        
        //Save the settings
        var data = {
            selection: {
                confirmed: false,
            },
            options_selected: optionsSelected,
        };
        
        this.saveSelection(data, 'select');
    },
    
    saveSelection: function(data, action) {
        if(typeof(action) === "undefined") {
            action = "select";
        }
    
        data.selection.choosing_instance_id = this.state.instance.instance.id;
        data.selection.id = this.state.selection.selection.id;
       
        var url = '../../selections/save.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(returnedData) {
                console.log(returnedData.response);
                var selectionState = {
                    allowSubmit: returnedData.allowSubmit,
                    optionsSelected: returnedData.optionsSelected,
                    ruleWarnings: returnedData.ruleWarnings,
                    selection: returnedData.selection,
                };
                
                if(action === "confirm") {
                    this.setState({
                        action: "review",
                    });
                }

                this.setState({
                    selection: selectionState,
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                if(action === "select") {
                    var errorMessage = 'Error selecting option';
                }
                else if(action === "confirm") {
                    var errorMessage = 'Error confirming selection';
                }
                
                this.setState({
                    //Show error in snackbar
                    snackbar: {
                        open: true,
                        message:  errorMessage + ' (' + err.toString() + ')',
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
    
    handleSort: function(field, fieldType) {
        var direction = 'asc';
        if(field === this.state.optionsSort.field) {
            if(this.state.optionsSort.direction === 'asc') {
                direction = 'desc';
            }
        }
    
        console.log("sort " + direction + " by " + field);
        
        var optionsState = this.sortOptions(this.deepCopy(this.state.options.options), field, fieldType, direction);
        
        this.setState({
            options: {
                options: optionsState,
                indexesById: this.updateOptionIndexesById(optionsState),
                loaded: true,
            },
            optionsSort: {
                direction: direction,
                field: field,
                fieldType: fieldType,
            },
        });
    },
    
    sortOptions: function(options, field, fieldType, direction) {
        options.sort(
            function(a, b) {
                var textTypes = ['text', 'wysiwyg', 'list', 'email', 'url'];
            
                //TODO: Deal with list types better 
                if(fieldType === 'date') {
                    if(a[field]) {
                        var dateA = a[field].date;
                        var valueA = new Date(parseInt(dateA.year), parseInt(dateA.month) - 1, parseInt(dateA.day));
                    }
                    else {
                        valueA = null;
                    }
                    if(b[field]) {
                        var dateB = b[field].date;
                        var valueB = new Date(parseInt(dateB.year), parseInt(dateB.month) - 1, parseInt(dateB.day));
                    }
                    else {
                        valueB = null;
                    }
                }
                else if(fieldType === 'datetime') {
                    if(a[field]) {
                        var dateA = a[field].date;
                        var timeA = a[field].time;
                        var valueA = new Date(parseInt(dateA.year), parseInt(dateA.month) - 1, parseInt(dateA.day), parseInt(timeA.hour), parseInt(timeA.minute), 0);
                    }
                    else {
                        valueA = null;
                    }
                    if(b[field]) {
                        var dateB = b[field].date;
                        var timeB = b[field].time;
                        var valueB = new Date(parseInt(dateB.year), parseInt(dateB.month) - 1, parseInt(dateB.day), parseInt(timeB.hour), parseInt(timeB.minute), 0);
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
                    return (direction === 'asc')?-1:1;
                }
                if (valueA > valueB) {
                    return (direction === 'asc')?1:-1;
                }

                // values must be equal
                return 0;
            }
        );
        
        return options;
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
        
        return optionIndexesById;
    },

    render: function() {
        var containerHandlers = {};
    
        if(this.state.action === 'view') {
            containerHandlers.favourite = this.handleFavourite;
            containerHandlers.removeOption = this.handleOptionRemove;
            containerHandlers.selectOption = this.handleOptionSelect;
            containerHandlers.sort = this.handleSort;
            containerHandlers.submit = this.handleSelectionSubmit;
        }
        else if(this.state.action === 'confirm') {
            //containerHandlers.confirm = this.handleSelectionConfirm;
            containerHandlers.backToEdit = this.handleSelectionBackToEdit;
            containerHandlers.finalConfirm = this.handleSelectionFinalConfirm;
            //containerHandlers.submit = this.handleSelectionConfirmDialogSubmit;
            //containerHandlers.confirmDialogOpen = this.handleSelectionConfirmDialogOpen;
            //containerHandlers.confirmDialogClose = this.handleSelectionConfirmDialogClose;
        }
        else if(this.state.action === 'review') {
            containerHandlers.backToEdit = this.handleSelectionBackToEdit;
        }
        else if(this.state.action === 'edit') {
            containerHandlers.change = this.handleOptionChange;
            containerHandlers.submit = this.handleOptionSubmit;
            containerHandlers.dialogOpen = this.handleOptionDialogOpen;
            containerHandlers.dialogClose = this.handleOptionDialogClose;
            containerHandlers.selectOption = this.handleOptionEditSelect;
            containerHandlers.sort = this.handleSort;
            containerHandlers.wysiwygChange = this.handleWysiwygChange;
        }
        
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    {(this.state.action === 'view')?
                        <Instructions
                            instance={this.state.instance}
                            rules={this.state.rules.rules}
                        />
                    :""}
                    {(this.state.action === 'view' || this.state.action === 'edit')?
                        <OptionsTable
                            action={this.state.action}
                            choice={this.props.choice}
                            favourites={this.state.favourites}
                            instance={this.state.instance}
                            optionContainerHandlers={containerHandlers}
                            optionEditing={this.state.optionEditing}
                            options={this.state.options}
                            optionSaveButton={this.state.optionSaveButton}
                            optionsSelected={this.state.selection.optionsSelected}
                            optionsSort={this.state.optionsSort}
                        />
                    :""}
                    {(this.state.action === 'view')?
                        <Basket
                            choice={this.props.choice}
                            instance={this.state.instance}
                            optionContainerHandlers={containerHandlers}
                            options={this.state.options}
                            rules={this.state.rules}
                            selection={this.state.selection}
                        />
                    :""}
                    
                    {(this.state.action === 'confirm')?
                        <div>
                            <Confirm
                                choice={this.props.choice}
                                instance={this.state.instance}
                                optionContainerHandlers={containerHandlers}
                                options={this.state.options}
                                rules={this.state.rules}
                                selection={this.state.selection}
                            />
                        </div>
                    :""}
                    
                    {(this.state.action === 'review')?
                        <Review
                            choice={this.props.choice}
                            instance={this.state.instance}
                            optionContainerHandlers={containerHandlers}
                            options={this.state.options}
                            selection={this.state.selection}
                        />
                    :""}

                    <Snackbar
                        autoHideDuration={3000}
                        message={this.state.snackbar.message}
                        onRequestClose={this.handleSnackbarClose}
                        open={this.state.snackbar.open}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
});

module.exports = OptionContainer;