import React from 'react';
import update from 'immutability-helper';

import Formsy from 'formsy-react';

import Snackbar from 'material-ui/Snackbar';
//import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
//import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';
import AppTitle from '../elements/app-title.jsx';
import Loader from '../elements/loader.jsx';
import SortWrapper from '../elements/wrappers/sort.jsx';

import Unavailable from './choice-unavailable.jsx';
import ChoosingInstructions from './choice-instructions.jsx';
import EditingInstructions from './option-edit-instructions.jsx';
import Basket from './selection-basket.jsx';
import Review from './selection-review.jsx';
import Confirmed from './selection-confirmed.jsx';
import ConfirmDialog from './selection-confirm-dialog.jsx';
import OptionsTable from './option-table.jsx';
import OptionsGrid from './option-grid.jsx';
import OptionsList from './option-list.jsx';
import OptionEditPage from './option-edit-page.jsx';
//import OptionFilterContainer from './option-filter-container.jsx';
import OptionViewPage from './option-view-page.jsx';


var optionEditingDefaults = {
    optionBeingEdited: null,
    title: 'Add Option',
};

var OptionContainer = React.createClass({
    loadInstanceFromServer: function() {
        if(this.props.action === 'edit') {
            var url = '../editing-instances/get-active.json';
        }
        else {
            var url = '../choosing-instances/get-active.json';
        }
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                var stateData = {};
                
                if(this.props.action === 'edit') {
                    var choosingInstance = [];
                    var editingInstance = data.editingInstance;
                }
                else {
                    var choosingInstance = data.choosingInstance;
                    var editingInstance = [];
                    
                    if(data.choosingInstance.id) {
                        stateData.favourites = data.favourites;
                        
                        if(data.choosingInstance.choosable) {
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
                    }
                }
                
                stateData.instance = {
                    editing: editingInstance,
                    choosing: choosingInstance,
                    loaded: true,
                };
            
                this.setState(stateData);
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    loadOptionsFromServer: function() {
        var url = 'get-options/' + this.props.action;
        url += '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    initialOptionIndexesById: data.optionIndexesById,
                    options: {
                        editableOptionsCount: data.editableOptionsCount,
                        indexesById: data.optionIndexesById,
                        loaded: true,
                        options: data.options,
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
                editing: [],
                choosing: [],
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
            submissionsSinceTimestamp: [],
            timestamp: Date.now(),
        };
        
        if(this.props.action === 'view') {
            //initialState.stepIndex = 0;
            initialState.optionBeingViewed = null;
        }
        //else if(this.props.action === 'confirmed') {
            //initialState.stepIndex = 2;
        //}
        else if(this.props.action === 'edit') {
            initialState.optionEditing = optionEditingDefaults;
        }

        return initialState;
    },

    componentWillMount: function() {
        if(this.props.action !== 'unavailable') {
            this.loadOptionsFromServer();
            this.loadInstanceFromServer();
        }
    },
    
    //Keep in container
    handleBackToEdit: function() {
        //Return to edit action
        this.setState({
            action: 'edit',
        });
    },
    
    //Keep in container
    handleBackToView: function() {
        this.setState({
            action: 'view'
        });
    },
    
    //Keep in container
    //When click Change Selection button, go back to view and reset timestamp
    handleChangeSelection: function() {
        this.setState({
            action: 'view',
            timestamp: Date.now(),
        });
    },
            
    //Could move to option-view-index (which doesn't exist yet)
    /*handleFavourite: function(choicesOptionId, action) {
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
        var url = '../shortlisted-options/favourite/' + action + '/' + this.state.instance.choosing.id + '/' + choicesOptionId;
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
                });
                this.handleSnackbarOpen('Error adding favourite (' + err.toString() + ')'); //Show error in snackbar
            }.bind(this)
        });
    },*/
    
    /*handleFilterButtonClick: function() {
        this.setState({
            action: 'filter_'  + this.state.action,
        });
    },
    
    handleFilterSubmit(filters) {
        console.log("Filter the options:");
        console.log(filters);
    },*/

    //Could move to option-view-index (which doesn't exist yet)
    handleInstructionsExpandChange(newExpandedState) {
        //console.log("Expand change: " + newExpandedState);
        this.setState({
            showInstructions: newExpandedState,
        })
    },
    
    /* OPTION EDITING METHODS */
    handleOptionApproveActionButtonClick: function(optionId) {
        this.setState({
            action: 'approve',
            optionBeingViewed: optionId,
        });
    },
    
    handleOptionChangeStatus: function(action, optionId, status, comments) {
        console.log(optionId + ': ' + (status ? '' : 'un') + action);
        
        var data = {
            action: action,
            choices_option_id: optionId,
            comments: comments,
            status: status
        };
        
        //Save the settings
        var url = 'status.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(returnedData) {
                console.log(returnedData.response);
                
                this.handleOptionEditReturnedData(returnedData);
                
                if(this.state.action !== 'edit') {
                    this.handleBackToEdit();
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.handleOptionEditError(err);
            }.bind(this)
        });
    },
   
    //Keep in container
    //But possibly move wysiwyg value state to option-edit-page - would need to set this in one of the lifecycle methods
    handleOptionEditButtonClick: function(optionId) {
        if(optionId) {
            var optionEditingState = {
                optionBeingEdited: optionId,
                title: 'Edit Option',
            };
        }
        //If no option is specified, a new option is being added so set optionBeingEdited to null
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
    
    //Could move to option-edit-index (which doesn't exist yet)
    handleOptionEditSelect: function(rowsSeleted) {
    
    },
    
    handleOptionEditReturnedData: function(returnedData) {
        var sortedOptions = this.props.sortHelper(returnedData.options, this.state.optionsSort.field, this.state.optionsSort.fieldType, this.state.optionsSort.direction);
        
        this.setState({
            action: 'edit',
            optionEditing: optionEditingDefaults,
            options: {
                editableOptionsCount: returnedData.editableOptionsCount,
                options: sortedOptions,
                indexesById: this.props.updateIndexesByIdHelper(sortedOptions),
                loaded: true,
            },
        });
        
        this.handleSnackbarOpen(returnedData.response);
    },
    
    handleOptionEditError: function(err) {
        this.handleSnackbarOpen('Save error (' + err.toString() + ')');
    },

    handleOptionRejectButtonClick: function() {
        console.log('reject option');
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
    
    handleOptionSelectFromGrid: function(optionsSelectedIds) {
        console.log(optionsSelectedIds);
        this.saveSelectedOptions(optionsSelectedIds);
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

    /*SELECTION METHODS*/
    getSubmissionsSinceTimestamp: function(successCallback) {
        //Check for submissions since the timestamp
        var url = '../selections/getConfirmed.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            success: function(returnedData) {
                successCallback(returnedData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                //Show error in snackbar
                this.handleSnackbarOpen('Error checking submissions since timestamp (' + err.toString() + ')');
            }.bind(this)
        });
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
            var url = '../selections/abandon.json';
            var data = {
                selection_id: this.state.selection.selection.id,
                instance_id: this.state.instance.choosing.id,
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
                    
                    //Show error in snackbar
                    this.handleSnackbarOpen('Error archiving selection (' + err.toString() + ')');
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
        //If not confirmed in the dialog, and not editable or there are warnings or there has been another submission since the timestamp, open the dialog
        if(!fromDialog) {
            this.getSubmissionsSinceTimestamp(this.handleSelectionConfirmButtonClickTimestampCheckSuccess)
        }
        else {
            this.handleSelectionConfirmDialogClose();
            this.handleSelectionConfirmFormSubmit();
        }
    },
    
    handleSelectionConfirmButtonClickTimestampCheckSuccess: function(returnedData) {
        var submissionsSinceTimestamp = [];
        for(var selection in returnedData.confirmedSelections) {
            if(returnedData.confirmedSelections[selection]['modified']['timestamp'] > (this.state.timestamp/1000)) {
                submissionsSinceTimestamp.push(returnedData.confirmedSelections[selection]);
            }
        }
    
        if(submissionsSinceTimestamp.length > 0 || !this.state.instance.choosing.editable || this.state.selection.ruleWarnings) {
            this.handleSelectionConfirmDialogOpen(submissionsSinceTimestamp);
        }
        //Otherwise, confirmed in the dialog, or editable and no warning and no other submission since timestamp, so submit the form
        else {
            this.handleSelectionConfirmFormSubmit();
        }
    },
    
    handleSelectionConfirmFormSubmit() {
        this.refs.confirm.submit();
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

    handleSelectionConfirmDialogOpen(submissionsSinceTimestamp) {
        this.setState({
            confirmDialogOpen: true,
            submissionsSinceTimestamp: submissionsSinceTimestamp,
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
    
    handleSnackbarOpen: function(message) {
        this.setState({
            snackbar: {
                open: true,
                message: message,
            },
        });
    },
    
    handleSort: function(field, fieldType, direction) {
        //Work out direction if it's not defined
        if(typeof(direction) === "undefined") {
            var direction = 'asc';
            if(field === this.state.optionsSort.field) {
                if(this.state.optionsSort.direction.toLowerCase() === 'asc') {
                    direction = 'desc';
                }
            }
        }
        
        var optionsState = this.props.sortHelper(this.props.deepCopyHelper(this.state.options.options), field, fieldType, direction);
        
        var optionsSelectedTableOrder = this.sortIdsByTableOrder(this.state.optionsSelectedTableOrder.slice(), optionsState);
        
        this.setState({
            options: {
                options: optionsState,
                indexesById: this.props.updateIndexesByIdHelper(optionsState),
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
    
    //Option grid is shown if choosing has opened (even if it has closed), or if user has additional roles
    isOptionGridShown: function() {
        return (this.state.instance.choosing.id && this.state.instance.choosing.opens.passed) || this.props.roles.length > 0;
    },
    
    //Selection is enabled if choosing is open, or if user is admin and instance is set up
    isOptionSelectionEnabled: function() {
        return (this.state.options.loaded && this.state.instance.loaded) && this.state.instance.choosing.choosable && (this.state.instance.choosing.open || this.props.roles.indexOf('admin') > -1);
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
    
        data.selection.choosing_instance_id = this.state.instance.choosing.id;
        data.selection.id = this.state.selection.selection.id || null;
       
        var url = '../selections/save.json';
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
                });
                //Show error in snackbar
                this.handleSnackbarOpen(errorMessage + ' (' + err.toString() + ')');
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
    
    getTopbar: function(action) {
        var topbarIconLeft=null;
        var topbarIconRight=null;

        var iconStyle = {color: 'white'};
        if(action === 'view' || action === 'confirmed' || action === 'edit') {
            //Show menu icon if sections is defined and not empty
            if(this.props.sections) {
                topbarIconLeft='menu';
            }
            
            var subtitle = this.props.choice.name;
            if(action === 'edit') {
                subtitle += ": Edit Options";
            }
            var title = <AppTitle subtitle={subtitle} />;
        
            if(action === 'view' || action === 'confirmed'){
                //If instance created and open or user is administrator, show selection basket or change selection buttons
                if(this.isOptionSelectionEnabled()) {
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
                var title = 'Review Your Choices';
            }
            else {
                var title = <AppTitle subtitle={this.props.choice.name} />;
            }
            
            //Unless action is unavailable...
            if(action !== 'unavailable') {
                //...left icon is always back arrow
                topbarIconLeft=<TopBarBackButton onTouchTap={this.handleBackToView} />;
            }
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
                    <div>
                        <EditingInstructions
                            editingInstance={this.state.instance.editing}
                            roles={this.props.roles}
                        />
                        <OptionsTable
                            action={this.state.action}
                            choice={this.props.choice}
                            instance={this.state.instance}
                            optionContainerHandlers={{
                                approve: this.handleOptionApproveActionButtonClick,
                                changeStatus: this.handleOptionChangeStatus,
                                edit: this.handleOptionEditButtonClick,
                                selectOption: this.handleOptionEditSelect,
                                sort: this.handleSort,
                                viewMore: this.handleOptionViewMoreFromEdit,
                            }}
                            options={this.state.options}
                            optionsSelectedTableOrder={this.state.optionsSelectedTableOrder}
                            optionsSort={this.state.optionsSort}
                            roles={this.props.roles}
                        />
                    </div>
                );
            case 'edit_option': //Edit option page
                return (
                    <OptionEditPage
                        choice={this.props.choice}
                        editingInstance={this.state.instance.editing}
                        optionContainerHandlers={{
                            backToEdit: this.handleBackToEdit,
                            handleError: this.handleOptionEditError,
                            handleReturnedData: this.handleOptionEditReturnedData,
                            snackbarClose: this.handleSnackbarClose,
                            snackbarOpen: this.handleSnackbarOpen,
                            wysiwygActivate: this.handleOptionEditWysiwygActivate,
                            wysiwygChange: this.handleOptionEditWysiwygChange,
                        }}
                        optionEditing={this.state.optionEditing}
                        options={this.state.options}
                        roles={this.props.roles}
                        snackbar={this.getSnackbar()}
                        wysiwygEditors={this.state.wysiwygEditors}
                    />
                );
            case 'view': //View
                return (
                    <div>
                        <ChoosingInstructions
                            abandonHandler={this.handleSelectionAbandonChanges}
                            confirmedSelection={this.state.confirmedSelection}
                            expanded={this.state.showInstructions}
                            expandChangeHandler={this.handleInstructionsExpandChange}
                            choosingInstance={this.state.instance.choosing}
                            roles={this.props.roles}
                            rules={this.state.rules.rules}
                        />
                        {this.isOptionGridShown() &&
                            <OptionsGrid
                                action={this.state.action}
                                choice={this.props.choice}
                                favourites={this.state.favourites}
                                optionContainerHandlers={{
                                    back: this.backToView,
                                    //favourite: this.handleFavourite,
                                    //filterClick: this.handleFilterButtonClick,
                                    selectOption: this.handleOptionSelectFromGrid,
                                    sort: this.handleSort,
                                    viewMore: this.handleOptionViewMoreFromView,
                                }}
                                options={this.state.options}
                                optionsSelectedTableOrder={this.state.optionsSelectedTableOrder}
                                optionsSort={this.state.optionsSort}
                                selectionEnabled={this.isOptionSelectionEnabled()}
                            />
                        }
                    </div>
                );
            /*case 'filter_view': //Filter from View page
            case 'filter_edit': //Filter from More page
                return (
                    <OptionFilterContainer
                        action={this.state.action}
                        choice={this.props.choice}
                        optionContainerHandlers={{
                            backToEdit: this.handleBackToEdit,
                            backToView: this.handleBackToView,
                            filter: this.handleFilterSubmit,
                        }}
                        options={this.state.options.options}
                    />
                );*/
            case 'more_view': //More
            case 'more_edit': //More
            case 'approve': //Approval
                return (
                    <OptionViewPage
                        action={action}
                        choice={this.props.choice}
                        choosingInstance={this.state.instance.choosing}
                        option={this.state.options.options[this.state.options.indexesById[this.state.optionBeingViewed]]}
                        optionContainerHandlers={{
                            backToEdit: this.handleBackToEdit,
                            backToView: this.handleBackToView,
                            changeStatus: this.handleOptionChangeStatus,
                            edit: this.handleOptionEditButtonClick,
                            selectOption: this.handleOptionSelectFromDetails,
                        }}
                        optionsSelectedTableOrder={this.state.optionsSelectedTableOrder}
                        roles={this.props.roles}
                        selectionEnabled={this.isOptionSelectionEnabled()}
                    />
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
                                choosingInstance={this.state.instance.choosing}
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
                            submissionsSinceTimestamp={this.state.submissionsSinceTimestamp}
                        />
                    </div>
                );

            case 'confirmed': //Confirmed
                return (
                    <Confirmed
                        choice={this.props.choice}
                        choosingInstance={this.state.instance.choosing}
                        optionContainerHandlers={{
                            change: this.handleChangeSelection,
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
    
    getSnackbar: function() {
        var snackbar = <Snackbar
                        autoHideDuration={3000}
                        message={this.state.snackbar.message}
                        onRequestClose={this.handleSnackbarClose}
                        open={this.state.snackbar.open}
                    />;
        return snackbar;
    },
    
    render: function() {
        var actionsWithOwnContainer = ['edit_option', 'filter_edit', 'filter_view', 'more_edit', 'more_view', 'approve'];
    
        if(this.state.action === 'unavailable') {
            var defaultAppTitle = <AppTitle subtitle={this.props.choice.name} />;
            return (
                <Unavailable
                    title={defaultAppTitle}
                />
            );
        }
        else if(actionsWithOwnContainer.indexOf(this.state.action) != -1) {
            return this.getContent(this.state.action);
        }
        else {
            return (
                <Container topbar={this.getTopbar(this.state.action)}>
                    <div>
                        {(!this.state.options.loaded || !this.state.instance.loaded)?
                            <Loader />
                        :
                            <div>
                                {this.getContent(this.state.action)}
                            </div>
                        }
                        {this.getSnackbar()}
                    </div>
                </Container>
            );
        }
    }
});

module.exports = SortWrapper(OptionContainer);