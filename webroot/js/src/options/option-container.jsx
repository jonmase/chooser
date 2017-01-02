import React from 'react';
import update from 'immutability-helper';

import Formsy from 'formsy-react';

import Snackbar from 'material-ui/Snackbar';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
//import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import Loader from '../elements/loader.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';

import Unavailable from './choice-unavailable.jsx';
import Instructions from './choice-instructions.jsx';
import Basket from './selection-basket.jsx';
import Review from './selection-review.jsx';
import Confirmed from './selection-confirmed.jsx';
import ConfirmDialog from './selection-confirm-dialog.jsx';
import OptionsTable from './option-table.jsx';
import OptionEditPage from './option-edit-page.jsx';
import DefaultFields from './default-fields.jsx';
import ExtraFieldLabelled from './extra-field-labelled.jsx';


var optionEditingDefaults = {
    optionBeingEdited: null,
    title: 'Add Option',
};
var optionSaveButtonDefaults = {
    enabled: true,
    label: 'Save',
};


var OptionContainer = React.createClass({
    loadInstanceFromServer: function() {
        if(this.props.action === 'edit') {
            this.setState({
                instance: {
                    loaded: true,
                }
            });
        }
        else {
            var url = '../../choosing-instances/get-active/' + this.props.choice.id + '.json';
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    var stateData = {
                        instance: {
                            instance: data.choosingInstance,
                            loaded: true,
                        }
                    };
                
                    if(data.choosingInstance.id) {
                        stateData.favourites = data.favourites;
                        stateData.optionsSelected = data.optionsSelected;
                        stateData.optionsSelectedTableOrder = data.optionsSelectedIds;
                        stateData.optionsSelectedPreferenceOrder = data.optionsSelectedIdsPreferenceOrder;
                        stateData.rules = {
                            rules: data.rules,
                            indexesById: data.ruleIndexesById,
                        };
                        stateData.selection = {
                            allowSubmit: data.allowSubmit,
                            ruleWarnings: data.ruleWarnings,
                            selection: data.selection,
                        };
                        
                        
                        //If the user has selected some options, do not show the instructions
                        if(data.selection.id && !data.choosingInstance.deadline.passed) {
                            stateData.showInstructions = false;
                        }
                        
                        //If selection is confirmed, add it to the confirmedSelection state data
                        if(data.selection.confirmed) {
                            stateData.confirmedSelection = data.selection;
                        }
                    }
                    
                    this.setState(stateData);
                }.bind(this),
                    error: function(xhr, status, err) {
                    console.error(url, status, err.toString());
                }.bind(this)
            });
        }
    },
    loadOptionsFromServer: function() {
        var url = '../get-options/' + this.props.choice.id + '/' + this.props.action;
        url += '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    initialOptionIndexesById: data.optionIndexesById,
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
            //stepIndex: 0,
            basketDisabled: false,
            canConfirm: true,
            confirmDialogOpen: false,
            confirmedSelection: [],
            favourites: [],
            initialOptionIndexesById: [],
            instance: {
                instance: [],
                loaded: false,
            },
            options: {
                options: [],
                indexesById: [],
                loaded: false,
            },
            optionsSelected: {},
            optionsSelectedTableOrder: [],
            optionsSelectedPreferenceOrder: [],
            optionsSort: {
                field: (this.props.choice.use_code)?'code':'title',
                fieldType: 'text',
                direction: 'asc',
            },
            rankSelectsDisabled: false,
            rules: {
                rules: [],
                indexesById: [],
            },
            selection: {
                allowSubmit: false,
                ruleWarnings: false,
                selection: [],
            },
            showInstructions: true,
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        if(this.props.action === 'view') {
            //initialState.stepIndex = 0;
            initialState.optionBeingViewed = null;
        }
        //else if(this.props.action === 'confirmed') {
            //initialState.stepIndex = 2;
        //}
        else if(this.props.action === 'edit') {
            initialState.canSaveOption = false;
            initialState.optionEditing = optionEditingDefaults;
            initialState.optionEditingCancelDialogOpen = false;
            initialState.optionEditingDirty = false;
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

    componentWillMount: function() {
        if(this.props.action !== 'unavailable') {
            this.loadOptionsFromServer();
            this.loadInstanceFromServer();
        }
    },
    
    handleBackToEdit: function() {
        //Return to edit action, and ensure cancel dialog is closed
        this.setState({
            action: 'edit',
            optionEditingCancelDialogOpen: false,
            optionEditingDirty: false,
        });
    },
    
    handleBackToView: function() {
        this.setState({
            action: 'view'
        });
    },
    
    handleFavourite: function(choicesOptionId, action) {
        if(!choicesOptionId || !action) {
            return false;
        }
    
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
    
    handleInstructionsExpandChange(newExpandedState) {
        //console.log("Expand change: " + newExpandedState);
        this.setState({
            showInstructions: newExpandedState,
        })
    },
    
    /* OPTION EDITING METHODS */
    handleOptionEditButtonClick: function(optionId) {
        //If no option is specified, a new option is being added so set optionBeingEdited to null
        if(optionId) {
            var optionEditingState = {
                optionBeingEdited: optionId,
                title: 'Edit Option',
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
                    var newOptionValuesState = update(newOptionValuesState, {['value_' + field.name]: {$set: value}});
                }
            }
            this.setState({optionValues: newOptionValuesState});
        }
        else {
            var optionEditingState = {
                optionBeingEdited: null,
                title: 'Add Option',
            };
        }
        
        this.setState({
            action: 'edit_option',
            optionEditing: optionEditingState,
        });
    },
    
    handleOptionEditCancelButtonClick: function() {
        //If the form is dirty...
        if(this.state.optionEditingDirty) {
            //...check that user definitely wants to cancel and lose changes
            this.setState({
                optionEditingCancelDialogOpen: true,
            });
        }
        //Otherwise, just go back to editing index page
        else {
            this.handleBackToEdit();
        }
    },
    
    handleOptionEditCancelDialogClose: function() {
        //Close the cancel confirm dialog
        this.setState({
            optionEditingCancelDialogOpen: false,
        });
    },
    
    handleOptionEditChange: function() {
        //If option is not yet dirty, set it to be
        if(!this.state.optionEditingDirty) {
            this.setState({
                optionEditingDirty: true,
            });
        }
    },
    
    handleOptionEditSaveButtonClick: function() {
        console.log('save button clicked');
    },
    
    handleOptionEditSaveButtonDisable: function() {
        this.setState({
            canSaveOption: false,
        });
    },
    
    handleOptionEditSaveButtonEnable: function() {
        this.setState({
            canSaveOption: true,
        });
    },
        
    handleOptionEditSelect: function(rowsSeleted) {
    },
    
    //Submit the edit option form
    handleOptionEditSubmit: function (option) {
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

    handleOptionEditWysiwygChange: function(element, value) {
        var optionValuesState = this.state.optionValues;
        var newOptionValuesState = update(optionValuesState, {
            ['value_' + element]: {$set: value},
        });
        this.setState({optionValues: newOptionValuesState});
        
        this.handleOptionEditChange();
    },
    
    handleOptionViewMoreFromEdit: function(optionId) {
        this.setState({
            action: 'more_edit',
            optionBeingViewed: optionId,
        });
    },

    handleOptionViewMoreFromView: function(optionId) {
        this.setState({
            action: 'more_view',
            optionBeingViewed: optionId,
        });
    },

    handleOptionSelectFromDetails(event, checked) {
        var optionId = this.state.optionBeingViewed;
        
        if(checked) {
            var optionsSelectedIds = this.state.optionsSelectedTableOrder.slice();
            optionsSelectedIds.push(optionId);
            this.saveSelectedOptions(optionsSelectedIds);
        }
        else {
            this.handleOptionSelectRemove(optionId);
        }
    },
    
    handleOptionSelectFromTable: function(rowsSelected) {
        var optionsSelectedIds = [];
        if(rowsSelected === 'all') {
            this.state.options.options.map(function(option) {
                optionsSelectedIds.push(option.id);
            }, this);
        }
        else if(rowsSelected === 'none') {
            //Leave optionsSelectedIds empty
        }
        else {
            rowsSelected.map(function(rowIndex) {
                optionsSelectedIds.push(this.state.options.options[rowIndex].id);
            }, this);
        }
        
        this.saveSelectedOptions(optionsSelectedIds);
    },
        
    handleOptionSelectRemove: function(optionId) {
        //Get the exising IDs
        var optionsSelectedIds = this.state.optionsSelectedTableOrder.slice();
        
        //Remove this ID from the selected array
        optionsSelectedIds.splice(optionsSelectedIds.indexOf(optionId), 1);
        
        this.saveSelectedOptions(optionsSelectedIds);
    },
    
    handleSelectionAbandonChanges: function() {
        console.log('abandon changes');
        
        //Check that there is a confirmed selected
        if(!this.state.confirmedSelection.id) {
            console.log('Error: no confirmed selection to abandon for');
        }
        
        //If the confirmed selection is the same as the selection, just go back to the confirmed page
        if(this.state.confirmedSelection.id === this.state.selection.selection.id) {
            this.setState({
                action: 'confirmed'
            });
        }
        //Otherwise, a new selection has been created for the edits
        else {
            //Archive the selection that is being edited, and return to review page
            var url = '../../selections/archive.json';
            var data = {
                selection_id: this.state.selection.selection.id,
                instance_id: this.state.instance.instance.id,
            }
            
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'POST',
                data: data,
                success: function(returnedData) {
                    console.log(returnedData.response);
                    
                    var selectionState = {
                        allowSubmit: returnedData.allowSubmit,
                        ruleWarnings: returnedData.ruleWarnings,
                        selection: returnedData.selection,
                    };
                    
                    var optionsSelectedIds = returnedData.optionsSelectedIds;
                    var optionsSelectedTableOrder = this.sortIdsByTableOrder(optionsSelectedIds);
                    
                    var newState = {
                        action: 'confirmed',
                        optionsSelected: returnedData.optionsSelected,
                        optionsSelectedTableOrder: optionsSelectedTableOrder,
                        optionsSelectedPreferenceOrder: returnedData.optionsSelectedIdsPreferenceOrder,
                        selection: selectionState,
                    };
                    
                    //If the returned selection is confirmed, put it in the confirmedSelection state
                    if(returnedData.selection.confirm) {
                        newState.confirmedSelection = returnedData.selection;
                    }
                    
                    this.setState(newState);
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(url, status, err.toString());
                    
                    this.setState({
                        //Show error in snackbar
                        snackbar: {
                            open: true,
                            message: 'Error archiving selection (' + err.toString() + ')',
                        }
                    });
                }.bind(this)
            });
        }
    },

    handleSelectionBasketSubmitButtonClick() {
        //Don't actually need to do anything at this stage, just change to review page
        this.setState({
            action: 'review'
        });
    },
    
    handleSelectionCommentsOverallChange: function(event, value) {
        var selectionState = this.state.selection;
        var newSelectionState = update(selectionState, {
            selection: {comments: {$set: value}},
        });
        this.setState({selection: newSelectionState});
    },
    
    handleSelectionCommentsPerOptionChange: function(event, value) {
        //Get the option ID from the input name (options.##.comments)
        var splitInputName = event.target.name.split(".");
        var optionId = parseInt(splitInputName[1]);
        
        var optionsSelectedState = this.state.optionsSelected;
        var newOptionsSelectedState = update(optionsSelectedState, {
            [optionId]: {comments: {$set: value}},
        });
        
        this.setState({optionsSelected: newOptionsSelectedState});
    },
    
    handleSelectionInfoToggle: function() {
        this.setState({
            showInstructions: !this.state.showInstructions
        });
    },
    
    handleSelectionOrderChange: function(event, value, ignore, inputName) {
        //Prevent further changes to ranking during reordering
        this.setState({
            rankSelectsDisabled: true,
        });
        
        //Get the option ID from the input name (options.##.ranks)
        var splitInputName = inputName.split(".");
        //var optionId = parseInt(inputName.substr(6),10);    //Names are ranks.##
        var optionId = parseInt(splitInputName[1]);
        
        //Get the optionsSelectedOrdered array from state
        var optionsSelectedPreferenceOrder = this.state.optionsSelectedPreferenceOrder.slice(0);
       
        //Remove this option from the ordered options array
        optionsSelectedPreferenceOrder.splice(optionsSelectedPreferenceOrder.indexOf(optionId),1);
        
        //Put this option back in the required position
        optionsSelectedPreferenceOrder.splice(value,0,optionId);
        
        this.setState({
            optionsSelectedPreferenceOrder: optionsSelectedPreferenceOrder,
            rankSelectsDisabled: false,
        });
    },
    
    handleSelectionReviewButtonClick: function() {
        //If the choice can be submitted, show the review page
        if(this.state.selection.allowSubmit) {
            this.setState({
                action: 'review'
            });
        }
        //Otherwise, go to the basket page
        else {
            this.setState({
                action: 'basket'
            });
        }
    },
    
    handleSelectionConfirmButtonClick: function(event, fromDialog) {
        //If not confirmed in the dialog, and not editable or there are warnings, open the dialog
        if(!fromDialog && (!this.state.instance.instance.editable || this.state.selection.ruleWarnings)) {
            this.handleSelectionConfirmDialogOpen();
        }
        //Otherwise, confirmed in the dialog, or editable and no warning, so submit the form
        else {
            this.handleSelectionConfirmDialogClose();
            this.refs.confirm.submit();
        }
    },
    
    handleSelectionConfirmButtonDisable: function () {
        this.setState({
            canConfirm: false
        });
    },
    
    handleSelectionConfirmButtonEnable: function () {
        this.setState({
            canConfirm: true
        });
    },

    handleSelectionConfirmDialogOpen() {
        this.setState({
            confirmDialogOpen: true,
        });
    },
    
    handleSelectionConfirmDialogClose() {
        this.setState({
            confirmDialogOpen: false,
        });
    },
    
    handleSelectionConfirmFinalSubmit(data) {
        if(!data.hasOwnProperty('selection')) {
            data.selection = {};
        }
        //Set confirmed to true
        data.selection.confirmed = true;
        
        //Save the selection
        this.saveSelection(data, 'confirm');
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
    
        var optionsState = this.sortOptions(this.deepCopy(this.state.options.options), field, fieldType, direction);
        
        var optionsSelectedTableOrder = this.sortIdsByTableOrder(this.state.optionsSelectedTableOrder.slice(), optionsState);
        
        this.setState({
            options: {
                options: optionsState,
                indexesById: this.updateOptionIndexesById(optionsState),
                loaded: true,
            },
            optionsSelectedTableOrder: optionsSelectedTableOrder,
            optionsSort: {
                direction: direction,
                field: field,
                fieldType: fieldType,
            },
        });
    },
    
    saveSelectedOptions: function(optionsSelectedIds) {
        //Optimistically update the selected options
        //Disable basket until options have been properly saved
        this.setState({
            optionsSelectedTableOrder: this.sortIdsByTableOrder(optionsSelectedIds),
            basketDisabled: true,
        });
        
        var optionsSelected = this.updateOptionsSelected(optionsSelectedIds);

        //Prevent submitting while request is sent
        var selectionState = this.state.selection;
        var newSelectionState = update(selectionState, {allowSubmit: {$set: false}});
        this.setState({
            selection: newSelectionState,
        });

        //Save the settings
        var data = {
            selection: {
                confirmed: false,
            },
            options: optionsSelected,
        };
        
        this.saveSelection(data, 'select');
    },
    
    saveSelection: function(data, action) {
        if(typeof(action) === "undefined") {
            action = "select";
        }
    
        data.selection.choosing_instance_id = this.state.instance.instance.id;
        data.selection.id = this.state.selection.selection.id || null;
       
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
                    ruleWarnings: returnedData.ruleWarnings,
                    selection: returnedData.selection,
                };
                
                var optionsSelectedIds = returnedData.optionsSelectedIds;
                var optionsSelectedTableOrder = this.sortIdsByTableOrder(optionsSelectedIds);
                
                var newState = {
                    basketDisabled: false,    //Re-enable basket (in case it was disabled for optimistic updates to be confirmed)
                    optionsSelected: returnedData.optionsSelected,
                    optionsSelectedTableOrder: optionsSelectedTableOrder,
                    optionsSelectedPreferenceOrder: returnedData.optionsSelectedIdsPreferenceOrder,
                    selection: selectionState,
                };
                
                //If the returned selection is confirmed, put it in the confirmedSelection state
                if(returnedData.selection.confirm) {
                    newState.confirmedSelection = returnedData.selection;
                }
                
                //If this was confirmation, move to the confirmed page and put the selection in confirmedSelection state
                if(action === "confirm") {
                    newState.action = 'confirmed';
                    newState.confirmedSelection = returnedData.selection;
                }

                this.setState(newState);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                if(action === "select") {
                    var errorMessage = 'Error selecting option';
                }
                else if(action === "confirm") {
                    var errorMessage = 'Error confirming selection';
                }
                
                //Roll back optionsSelectedTableOrder to existing optionsSelected
                //Loop through state.optionsSelected and add each ID to optionsSelectedIds
                var optionsSelectedIds = [];
                for (var optionId in this.state.optionsSelected) {
                    if (this.state.optionsSelected.hasOwnProperty(optionId)) {
                        optionsSelectedIds.push(parseInt(optionId, 10));
                    }
                }
                    
                this.setState({
                    //Update state with optionsSelectedIds sorted by table order
                    basketDisabled: false,    //Re-enable basket (in case it was disabled for optimistic updates to be confirmed)
                    optionsSelectedTableOrder: this.sortIdsByTableOrder(optionsSelectedIds),
                    //Show error in snackbar
                    snackbar: {
                        open: true,
                        message:  errorMessage + ' (' + err.toString() + ')',
                    }
                });
            }.bind(this)
        });
    },
    
    updateOptionsSelected: function(optionsSelectedIds) {
        //Loop through the selected option IDs, adding each optionSelected to a new optionsSelected object
        var optionsSelected = {};
        optionsSelectedIds.forEach(function(optionId) {
            if(typeof(this.state.optionsSelected[optionId]) === "undefined") {
                //option not previously selected, so just pass id and table order
                optionsSelected[optionId] = {
                    choices_option_id: optionId,
                    table_order: this.state.initialOptionIndexesById[optionId],
                };
            }
            else {
                //option was previously selected, so pass id, rank/points/comments and table order (used if rank is null)
                optionsSelected[optionId] = {
                    choices_option_id: optionId,
                    comments: this.state.optionsSelected[optionId].comments,
                    points: this.state.optionsSelected[optionId].points,
                    rank: this.state.optionsSelected[optionId].rank,
                    table_order: this.state.initialOptionIndexesById[optionId],
                };
            }
        }, this);
        return optionsSelected;
    },
    
    sortIdsByTableOrder: function(optionIds, options) {
        var idsSortedByTableOrder = [];
        if(typeof(options) === "undefined") {
            options = this.state.options.options;
        }
        options.forEach(function(option) {
            if(optionIds.indexOf(option.id) > -1) {
                idsSortedByTableOrder.push(option.id);
            }
        });
        return idsSortedByTableOrder;
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
    
    getTopbar: function(action) {
        var title = <AppTitle subtitle={this.props.choice.name} />;
        var topbarIconLeft=null;
        var topbarIconRight=null;
        //var showStepTabs=true;

        var iconStyle = {color: 'white'};
        if(action === 'view' || action === 'confirmed' || action === 'edit') {
            //Show menu icon if sections is defined and not empty
            if(this.props.sections) {
                topbarIconLeft='menu';
            }
        
            if(action === 'view' || action === 'confirmed'){
                //If instance created and open or user is administrator, show selection basket or change selection buttons
                if((this.state.options.loaded && this.state.instance.loaded) && (this.state.instance.instance.id && ((this.state.instance.instance.opens.passed && (!this.state.instance.instance.deadline.passed || !this.state.instance.instance.extension.passed)) || this.props.role === 'admin'))) {
                    if(action === 'view') {
                        topbarIconRight=
                            <div style={{paddingRight: '10px'}}>
                                {/*<Badge
                                    badgeContent={this.state.optionsSelectedTableOrder.length || ""}
                                    primary={true}
                                    badgeStyle={{top: 0, right: -5, backgroundColor: 'none', fontSize: 16}}
                                    style={{padding: 0}}
                                >
                                    <IconButton
                                        disabled={this.state.basketDisabled}
                                        iconClassName="material-icons"
                                        onTouchTap={this.handleSelectionReviewButtonClick}
                                        iconStyle={iconStyle}
                                    >
                                        shopping_basket
                                    </IconButton>
                                </Badge>*/}
                                {(this.state.confirmedSelection.id)&&
                                    <RaisedButton
                                        label="Cancel Changes"
                                        onTouchTap={this.handleSelectionAbandonChanges}
                                        //primary={true}
                                        secondary={true}
                                        style={{marginRight: '1em'}}
                                    />
                                }
                                <RaisedButton 
                                    disabled={this.state.basketDisabled}
                                    label="Review & Submit" 
                                    onTouchTap={this.handleSelectionReviewButtonClick}
                                    //primary={true}
                                    style={{marginTop: '6px'}}
                                />
                            </div>;
                    }
                    else if(action === 'confirmed') {
                        /*topbarIconRight=
                            <IconButton
                                iconClassName="material-icons"
                                onTouchTap={this.handleBackToView}
                                iconStyle={iconStyle}
                            >
                                edit
                            </IconButton>;*/
                    }
                }
            }
        }
        //
        else {
            if(action === 'basket' || action === 'review') {
                title = 'Review Your Choices';
            }
            else if(action === 'more_view' || action === 'more_edit') {
                title = 'Option Details';
            }
            else if(action === 'edit_option') {
                title = this.state.optionEditing.title;
            }
            
            var backAction = this.handleBackToView;
            if(action === 'more_edit') {
                var backAction = this.handleBackToEdit;
            }
            else if(action === 'edit_option') {
                var backAction = this.handleOptionEditCancelButtonClick;
            }
           
            if(action === 'more_view') {
                topbarIconRight=<Checkbox 
                    disableTouchRipple={true}
                    iconStyle={{color: 'white', fill: 'white', height: '48px', width: '48px'}}
                    label={false} 
                    onCheck={this.handleOptionSelectFromDetails}
                    //checked={typeof(this.state.optionsSelected[this.state.optionBeingViewed]) !== "undefined"}
                    checked={this.state.optionsSelectedTableOrder.indexOf(this.state.optionBeingViewed) > -1}
                />;
            }
            else if(action === 'more_edit') {
                topbarIconRight = <EditButton
                    handleEdit={this.handleOptionEditButtonClick} 
                    iconStyle={{color: 'white'}}
                    id={this.state.optionBeingViewed}
                    tooltip=""
                />;
            }
            else if(action === 'edit_option') {
                topbarIconRight = <RaisedButton 
                    disabled={!this.state.canSaveOption || !this.state.optionSaveButton.enabled}
                    //disabled={!this.state.optionSaveButton.enabled}
                    label="Save" 
                    onTouchTap={this.handleOptionEditSaveButtonClick}
                    //primary={true}
                    style={{marginTop: '6px'}}
                    type="submit"
                />;
            }
        
            //Left icon is always back arrow
            topbarIconLeft=
                <IconButton
                    iconClassName="material-icons"
                    onTouchTap={backAction}
                    iconStyle={iconStyle}
                >
                    arrow_back
                </IconButton>;
        }
       
        return (
            <TopBar 
                dashboardUrl={this.props.dashboardUrl} 
                iconLeft={topbarIconLeft}
                iconRight={topbarIconRight}
                sections={this.props.sections} 
                //showStepTabs={showStepTabs}
                //tabsGetContent={this.getStepContent}
                //tabsValue={this.stepIndex}
                //tabsChangeHandler={this.handleTabChange}
                title={title}
            />
        );
    },

    getContent: function(action) {
        switch(action) {
            case 'edit': //Edit Index
                return (
                    <OptionsTable
                        action={this.state.action}
                        choice={this.props.choice}
                        instance={this.state.instance}
                        optionContainerHandlers={{
                            change: this.handleOptionChange,
                            edit: this.handleOptionEditButtonClick,
                            submit: this.handleOptionEditSubmit,
                            selectOption: this.handleOptionEditSelect,
                            sort: this.handleSort,
                            viewMore: this.handleOptionViewMoreFromEdit,
                            wysiwygChange: this.handleOptionEditWysiwygChange,
                        }}
                        optionEditing={this.state.optionEditing}
                        options={this.state.options}
                        optionSaveButton={this.state.optionSaveButton}
                        optionsSelectedTableOrder={this.state.optionsSelectedTableOrder}
                        optionsSort={this.state.optionsSort}
                    />
                );
            case 'edit_option': //Edit option page
                return (
                    <OptionEditPage
                        cancelDialogOpen={this.state.optionEditingCancelDialogOpen}
                        choice={this.props.choice}
                        optionContainerHandlers={{
                            backToEdit: this.handleBackToEdit,
                            cancelDialogClose: this.handleOptionEditCancelDialogClose,
                            change: this.handleOptionEditChange,
                            disableSaveButton: this.handleOptionEditSaveButtonDisable,
                            enableSaveButton: this.handleOptionEditSaveButtonEnable,
                            submit: this.handleOptionEditSubmit,
                            wysiwygChange: this.handleOptionEditWysiwygChange,
                        }}
                        optionEditing={this.state.optionEditing}
                        options={this.state.options}
                    />
                );
            case 'view': //View
                return (
                    <div>
                        <Instructions
                            abandonHandler={this.handleSelectionAbandonChanges}
                            confirmedSelection={this.state.confirmedSelection}
                            expanded={this.state.showInstructions}
                            expandChangeHandler={this.handleInstructionsExpandChange}
                            instance={this.state.instance}
                            role={this.props.role}
                            rules={this.state.rules.rules}
                        />
                        {(this.props.role === 'admin' || this.props.role === 'extra' || this.state.instance.instance.opens.passed) &&
                            <OptionsTable
                                action={this.state.action}
                                choice={this.props.choice}
                                favourites={this.state.favourites}
                                instance={this.state.instance}
                                optionContainerHandlers={{
                                    favourite: this.handleFavourite,
                                    selectOption: this.handleOptionSelectFromTable,
                                    sort: this.handleSort,
                                    viewMore: this.handleOptionViewMoreFromView,
                                }}
                                options={this.state.options}
                                optionsSelectedTableOrder={this.state.optionsSelectedTableOrder}
                                optionsSort={this.state.optionsSort}
                            />
                        }
                    </div>
                );
            case 'more_view': //More
            case 'more_edit': //More
                var defaults = {
                    //code: this.props.choice.use_code,
                    //title: this.props.choice.use_title,
                    code: false,    //Don't use code or title, as these are shown at the top of the page
                    title: false,
                    description: this.props.choice.use_description,
                    min_places: this.props.choice.use_min_places,
                    max_places: this.props.choice.use_max_places,
                    points: this.props.choice.use_points,
                };
                
                var option = this.state.options.options[this.state.options.indexesById[this.state.optionBeingViewed]];
        
                return (
                    <div>
                        <h3>
                            {this.props.choice.use_code && (option.code + ": ")}
                            {option.title}
                        </h3>
                    
                        <DefaultFields
                            defaults={defaults}
                            option={option}
                        />
                        
                        {this.props.choice.extra_fields.map(function(field) {
                            var value = null;
                            if(option && typeof(option[field.name]) !== "undefined") {
                                value = option[field.name];
                            }
                        
                            return (
                                <ExtraFieldLabelled
                                    explanation={field.explanation}
                                    extra={field.extra}
                                    //field={field}
                                    key={field.id}
                                    label={field.label}
                                    options={field.options}
                                    type={field.type}
                                    value={value}
                                />
                            );
                        }, this)}
                    </div>
                );
            case 'basket': //Basket
                return (
                    <Basket
                        instance={this.state.instance}
                        optionContainerHandlers={{
                            change: this.handleBackToView,
                            remove: this.handleOptionSelectRemove,
                            submit: this.handleSelectionBasketSubmitButtonClick,
                        }}
                        options={this.state.options}
                        optionsSelectedTableOrder={this.state.optionsSelectedTableOrder}
                        rules={this.state.rules}
                        selection={this.state.selection}
                        useCode={this.props.choice.use_code}
                    />
                );    
            case 'review': //Review
                return (
                    <div>
                        <Formsy.Form
                            id="selection_confirm"
                            method="POST"
                            onValid={this.handleSelectionConfirmButtonEnable}
                            onInvalid={this.handleSelectionConfirmButtonDisable}
                            onValidSubmit={this.handleSelectionConfirmFinalSubmit}
                            noValidate={true}
                            ref="confirm"
                        >
                            <Review
                                choice={this.props.choice}
                                instance={this.state.instance}
                                optionContainerHandlers={{
                                    change: this.handleBackToView,
                                    confirm: this.handleSelectionConfirmButtonClick,
                                    orderChange: this.handleSelectionOrderChange,
                                    overallCommentsChange: this.handleSelectionCommentsOverallChange,
                                    optionCommentsChange: this.handleSelectionCommentsPerOptionChange,
                                }}
                                options={this.state.options}
                                optionsSelected={this.state.optionsSelected}
                                optionsSelectedPreferenceOrder={this.state.optionsSelectedPreferenceOrder}
                                rankSelectsDisabled={this.state.rankSelectsDisabled}
                                rules={this.state.rules}
                                selection={this.state.selection}
                            />
                        </Formsy.Form>
                        <ConfirmDialog 
                            open={this.state.confirmDialogOpen}
                            handlers={{
                                close: this.handleSelectionConfirmDialogClose,
                                submit: this.handleSelectionConfirmButtonClick,
                            }}
                            instance={this.state.instance}
                            rules={this.state.rules}
                            selection={this.state.selection}
                        />
                    </div>
                );

            case 'confirmed': //Confirmed
                return (
                    <Confirmed
                        choice={this.props.choice}
                        instance={this.state.instance}
                        optionContainerHandlers={{
                            change: this.handleBackToView,
                        }}
                        options={this.state.options}
                        optionsSelected={this.state.optionsSelected}
                        optionsSelectedPreferenceOrder={this.state.optionsSelectedPreferenceOrder}
                        rankSelectsDisabled={this.state.rankSelectsDisabled}
                        selection={this.state.selection}
                    />
                );
            default:
                return null;
        }
    },
    
    render: function() {
        return (
            <Container topbar={this.getTopbar(this.state.action)} title={(this.state.action === 'edit')?"Dashboard - Edit Options":((this.state.action === 'approve')?"Dashboard - Approve Options":"")}>
                <div>
                    {(this.state.action === 'unavailable')?
                        <Unavailable
                            instance={this.state.instance}
                            rules={this.state.rules.rules}
                        />
                    :
                        (!this.state.options.loaded || !this.state.instance.loaded)?
                            <Loader />
                        :
                            <div>
                                {this.getContent(this.state.action)}
                            </div>
                    }
                    <Snackbar
                        autoHideDuration={3000}
                        message={this.state.snackbar.message}
                        onRequestClose={this.handleSnackbarClose}
                        open={this.state.snackbar.open}
                    />
                </div>
            </Container>
        );
    }
});

module.exports = OptionContainer;