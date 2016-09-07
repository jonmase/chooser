import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';

import OptionsTable from './options-table.jsx';

import ChooserTheme from '../theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var IndexContainer = React.createClass({
    getInitialState: function () {
        var initialState = {
            optionBeingEdited: null,
            optionDialogOpen: false,
            optionDialogTitle: 'Add Option',
            optionIndexesById: this.props.optionIds,
            optionSaveButtonEnabled: true,
            optionSaveButtonLabel: 'Save',
            options: this.props.options,
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        if(this.props.choice.use_description) {
            initialState.optionValue_description = '';
        }
        for(var extra in this.props.choice.extra_fields) {
            var field = this.props.choice.extra_fields[extra];
            if(field.type === 'wysiwyg') {
                initialState['optionValue_' + field.name] = '';
            }
        }

        return initialState;
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
            if(this.props.choice.use_description) {
                stateData.optionValue_description = this.state.options[this.state.optionIndexesById[optionId]].description;
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

    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    handleWysiwygChange: function(element, value) {
        var stateData = {};
        stateData['optionValue_' + element] = value;
        this.setState(stateData);
        
        this.handleOptionChange();
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
        var optionEditHandlers = {
            change: this.handleOptionChange,
            submit: this.handleOptionSubmit,
            dialogOpen: this.handleOptionDialogOpen,
            dialogClose: this.handleOptionDialogClose,
            wysiwygChange: this.handleWysiwygChange,
        };
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <OptionsTable
                        action={'edit'}
                        state={this.state}
                        choice={this.props.choice}
                        optionEditHandlers={optionEditHandlers}
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