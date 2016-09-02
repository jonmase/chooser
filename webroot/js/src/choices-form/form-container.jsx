import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';
import DefaultFieldToggles from './default-field-toggles.jsx';
import ExtraFields from './extra-fields.jsx';

import ChooserTheme from '../theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var FormContainer = React.createClass({
    getInitialState: function () {
        return {
            addType: null,
            addExtraDialogOpen: false,
            deleteExtraDialogOpen: false,
            deleteExtraFieldId: null,
            editExtraDialogOpen: false,
            editExtraFieldId: null,
            extraFields: this.props.choice.extra_fields,
            extraFieldIndexesById: this.props.choice.extra_field_ids,
            defaults: {
                code: this.props.choice.use_code,
                title: this.props.choice.use_title,
                description: this.props.choice.use_description,
                min_places: this.props.choice.use_min_places,
                max_places: this.props.choice.use_max_places,
                points: this.props.choice.use_points,
            },
            defaultsButton: {
                disabled: true,
                label: 'Saved',
            },
            snackbar: {
                open: false,
                message: '',
            },
        };
    },
    
    //Handle a change to the default field settings - update defaults state and enable the save button
    handleDefaultsChange: function(event) {
        //Create an object of the defaults to be updated in state
        var updatedDefaults = {};
        updatedDefaults[event.target.name] = event.target.checked;
        
        //Use update to create new object by merging state with updatedDefaults
        var defaults = update(this.state.defaults, {$merge: updatedDefaults});

        this.setState({
            defaults: defaults,
            defaultsButton: {
                disabled: false,
                label: 'Save',
            },
        });
    },
    
    //Submit the defaults form
    handleDefaultsSubmit: function (defaults) {
        this.setState({
            defaultsButton: {
                disabled: true,
                label: 'Saving',
            },
        });

        console.log("Saving default field settings for Choice " + this.props.choice.id + ": ", defaults);
        
        //Save the settings
        var url = '../form_defaults/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: defaults,
            success: function(returnedData) {
                console.log(returnedData.response);

                var stateData = {};
                stateData.defaultsButton = {
                    disabled: true,
                    label: 'Saved',
                };
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    defaultsButton: {
                        disabled: false,
                        label: 'Resave',
                    },
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
                console.error(url, status, err.toString());
            }.bind(this)
        }); 
    },
    
    handleAddExtraTypeChange: function (event, value) {
        console.log("Field type changed to " + value);
        this.setState({
            addType: value,
        });
    },

    handleAddExtraDialogOpen: function() {
        this.setState({
            addExtraDialogOpen: true,
            addType: null,
        });
    },

    handleAddExtraDialogClose: function() {
        this.setState({
            addExtraDialogOpen: false,
            addType: null,
        });
    },

    //Submit the defaults form
    handleAddExtraSubmit: function (field) {
        console.log("Saving extra field for Choice " + this.props.choice.id + ": ", field);
        
        //Save the settings
        var url = '../../ExtraFields/save/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: field,
            success: function(returnedData) {
                console.log(returnedData.response);
                
                var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                
                stateData.extraFields = this.state.extraFields;    //Get the current extraFields
                stateData.extraFields.push(returnedData.field);   //Add the new field to current extraFields
                
                //Update the extraFieldIndexesById
                stateData.extraFieldIndexesById = this.updateExtraFieldIndexesById(stateData.extraFields);
                
                stateData.addExtraDialogOpen = false;   //Close the Dialog
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
                console.error(url, status, err.toString());
            }.bind(this)
        }); 
    },
    
    handleDeleteExtraDialogOpen: function(event) {
        this.setState({
            deleteExtraDialogOpen: true,
            deleteExtraFieldId: event.currentTarget.id.substr(12),
        });
    },

    handleDeleteExtraDialogClose: function() {
        this.setState({
            deleteExtraDialogOpen: false,
            deleteExtraFieldId: null,
        });
    },

    //Submit the delete extra field form
    handleDeleteExtraSubmit: function () {
        var data = {
            id: this.state.deleteExtraFieldId,
        }
    
        console.log("Deleting extra field for Choice " + this.props.choice.id + ": " + data.id);
        
        //Save the settings
        var url = '../../ExtraFields/delete';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(returnedData) {
                console.log(returnedData.response);
                
                var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }

                stateData.extraFields = this.state.extraFields;    //Get the current extraFields
                stateData.extraFields.splice(this.state.extraFieldIndexesById[returnedData.fieldId], 1);   //Remove the field from current extraFields
                
                //Update the extraFieldIndexesById
                stateData.extraFieldIndexesById = this.updateExtraFieldIndexesById(stateData.extraFields);
                
                stateData.deleteExtraDialogOpen = false;    //Close the Dialog
                stateData.deleteExtraFieldId = null;

                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    snackbar: {
                        open: true,
                        message: 'Delete error (' + err.toString() + ')',
                    }
                });
                console.error(url, status, err.toString());
            }.bind(this)
        }); 
    },
    
    handleEditExtraDialogOpen: function(event) {
        this.setState({
            editExtraDialogOpen: true,
            editExtraFieldId: event.currentTarget.id.substr(12),
        });
    },

    handleEditExtraDialogClose: function() {
        this.setState({
            editExtraDialogOpen: false,
            editExtraFieldId: null,
        });
    },

    //Submit the defaults form
    handleEditExtraSubmit: function (field) {
        field.id = this.state.editExtraFieldId;
    
        console.log("Saving extra field for Choice " + this.props.choice.id + ": ", field);
        
        //Save the settings
        var url = '../../ExtraFields/save/' + this.props.choice.id;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: field,
            success: function(returnedData) {
                console.log(returnedData.response);
                
                var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }

                stateData.extraFields = this.state.extraFields;    //Get the current extraFields
                stateData.extraFields.splice(this.state.extraFieldIndexesById[returnedData.field.id], 1, returnedData.field);   //Replace the field in current extraFields
                
                //Update the extraFieldIndexesById (shouldn't really need to do this)
                stateData.extraFieldIndexesById = this.updateExtraFieldIndexesById(stateData.extraFields);

                stateData.editExtraDialogOpen = false;    //Close the Dialog
                stateData.editExtraFieldId = null;

                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
                console.error(url, status, err.toString());
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
    
    updateExtraFieldIndexesById: function(extraFields) {
        var extraFieldIndexesById = {};
        extraFields.forEach(function(field, index) {
            extraFieldIndexesById[field.id] = index;
        });
        return extraFieldIndexesById;
    },

    render: function() {
        var defaultsHandlers={
            change: this.handleDefaultsChange,
            submit: this.handleDefaultsSubmit,
        };

        var extrasHandlers={
            typeChange: this.handleAddExtraTypeChange,
            addDialogOpen: this.handleAddExtraDialogOpen,
            addDialogClose: this.handleAddExtraDialogClose,
            addSubmit: this.handleAddExtraSubmit,
            deleteDialogOpen: this.handleDeleteExtraDialogOpen,
            deleteDialogClose: this.handleDeleteExtraDialogClose,
            deleteSubmit: this.handleDeleteExtraSubmit,
            editDialogOpen: this.handleEditExtraDialogOpen,
            editDialogClose: this.handleEditExtraDialogClose,
            editSubmit: this.handleEditExtraSubmit,
        };
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <p>Define the fields that you want to appear on the form for creating/editing options. </p>
                    <DefaultFieldToggles 
                        choice={this.props.choice}
                        state={this.state}
                        handlers={defaultsHandlers}
                    />
                    <ExtraFields 
                        state={this.state}
                        handlers={extrasHandlers}
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

module.exports = FormContainer;