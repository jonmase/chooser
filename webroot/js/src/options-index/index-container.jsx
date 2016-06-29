import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';

import OptionsTable from './options-table.jsx';

import ChooserTheme from '../theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var IndexContainer = React.createClass({
    getInitialState: function () {
        var initialState = {
            addOptionDialogOpen: false,
            addSaveButtonEnabled: true,
            addSaveButtonLabel: 'Save',
            options: this.props.options,
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        if(this.props.choice.use_description) {
            initialState.addValue_description = '';
        }
        for(var extra in this.props.choice.extra_fields) {
            var field = this.props.choice.extra_fields[extra];
            if(field.type === 'wysiwyg') {
                initialState['addValue_' + field.name] = '';
            }
        }

        return initialState;
    },
    
    handleAddChange: function() {
    
    },
    
    handleAddDialogOpen: function() {
        this.setState({
            addOptionDialogOpen: true,
        });
    },
    
    handleAddDialogClose: function() {
        this.setState({
            addOptionDialogOpen: false,
        });
    },
    
    //Submit the add option form
    handleAddSubmit: function (option) {
        //this.setState({
        //    addSaveButtonEnabled: false,
        //    addSaveButtonLabel: 'Saving',
        //});

        //Get the alloy editor data
        if(this.props.choice.use_description) {
            option.description = this.state.addValue_description;
        }
        for(var extra in this.props.choice.extra_fields) {
            var field = this.props.choice.extra_fields[extra];
            if(field.type === 'wysiwyg') {
                option[field.name] = this.state['addValue_' + field.name];
            }
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
                stateData.saveButtonEnabled = true;
                stateData.saveButtonLabel = 'Save';
                stateData.addOptionDialogOpen = false;   //Close the Dialog

                //Add the new option to state
                //stateData.options = this.state.options;    //Get the current options
                //stateData.options.push(returnedData.option);   //Add the new option to current options
                
                //Update the extraFieldIndexesById
                //stateData.optionIndexesById = this.updateExtraFieldIndexesById(stateData.extraFields);
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    saveButtonEnabled: true,
                    saveButtonLabel: 'Resave',
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
        stateData['addValue_' + element] = value;
        this.setState(stateData);
        
        this.handleAddChange();
    },
    
    render: function() {
        var addHandlers = {
            change: this.handleAddChange,
            submit: this.handleAddSubmit,
            dialogOpen: this.handleAddDialogOpen,
            dialogClose: this.handleAddDialogClose,
            wysiwygChange: this.handleWysiwygChange,
        };
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <OptionsTable
                        state={this.state}
                        choice={this.props.choice}
                        addHandlers={addHandlers}
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