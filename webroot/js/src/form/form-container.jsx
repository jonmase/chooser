import React from 'react';
import update from 'react-addons-update';

import Snackbar from 'material-ui/Snackbar';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import SortWrapper from '../elements/wrappers/sort.jsx';
import FieldsWrapper from '../elements/wrappers/fields.jsx';

import DefaultFields from './default-fields.jsx';
import ExtraFields from './extra-fields.jsx';
import ExtraFieldEdit from './extra-field-edit.jsx';

var FormContainer = React.createClass({
    loadExtraFieldsFromServer: function() {
        var url = '../extra-fields/get.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    extraFields: data.extraFields,
                    extraFieldIndexesById: data.extraFieldIndexesById,
                    loaded: true,
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    
    getInitialState: function () {
        var initialState = {
            action: 'view',
            defaultsButton: {
                disabled: true,
                label: 'Saved',
            },
            extraFields: [],
            extraFieldIndexesById: [],
            fieldBeingEditedId: null,
            loaded: false,
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        var defaultFields = this.props.allDefaultFields;
        var defaults = {};
        defaultFields.forEach(function(field) {
            defaults[field.name] = this.props.choice['use_' + field.name];
        }, this);
        
        initialState.defaults = defaults;
    
        return initialState;
    },
    
    componentWillMount: function() {
        this.loadExtraFieldsFromServer();
    },
    
    handleBackToView: function() {
        this.setState({
            action: 'view',
            fieldBeingEditedId: null,
        });
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
        var url = 'form_defaults';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: defaults,
            success: function(returnedData) {
                console.log(returnedData.response);

                this.handleSnackbarOpen(returnedData.response);
                
                this.setState({
                    defaultsButton: {
                        disabled: true,
                        label: 'Saved',
                    }
                });
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    defaultsButton: {
                        disabled: false,
                        label: 'Resave',
                    }
                });
                
                this.handleSnackbarOpen('Save error (' + err.toString() + ')');
                
                console.error(url, status, err.toString());
            }.bind(this)
        }); 
    },
    
    handleExtraEditClick: function(fieldId) {
        this.setState({
            action: 'edit',
            fieldBeingEditedId: (typeof(fieldId) !== "undefined"?fieldId:null),
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
    
    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    handleSuccess: function(returnedData) {
        //stateData.extraFieldIndexesById = this.updateExtraFieldIndexesById(stateData.extraFields);
        //TODO: update PHP functions to return full list of extra fields
        
        this.setState({
            action: 'view',
            extraFields: returnedData.extraFields,
            extraFieldIndexesById: returnedData.extraFieldIndexesById,
        });
        
        this.handleSnackbarOpen(returnedData.response);
    },
    
    getFieldAndTypeFromId: function(fieldId) {
        var field = this.props.deepCopyHelper(this.state.extraFields[this.state.extraFieldIndexesById[fieldId]]);
        
        var fieldTypes = this.props.getFieldTypes();
        
        fieldTypes.some(function(type) {
            if(type.value === field.type) {
                field.type = type;
            }
        });
        return field;
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
            editButtonClick: this.handleExtraEditClick,
            getField: this.getFieldAndTypeFromId,
            snackbarOpen: this.handleSnackbarOpen,
            success: this.handleSuccess,
        };
        
        var extrasEditHandlers={
            backButtonClick: this.handleBackToView,
            getField: this.getFieldAndTypeFromId,
            snackbarOpen: this.handleSnackbarOpen,
            success: this.handleSuccess,
        };
        
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={null}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name + ": Options Form"} />}
        />;
        
        var snackbar = <Snackbar
            open={this.state.snackbar.open}
            message={this.state.snackbar.message}
            autoHideDuration={3000}
            onRequestClose={this.handleSnackbarClose}
        />

        if(this.state.action === 'view') {
            return (
                <Container topbar={topbar}>
                    <div>
                        <DefaultFields 
                            choice={this.props.choice}
                            defaults={this.state.defaults}
                            defaultsButton={this.state.defaultsButton}
                            handlers={defaultsHandlers}
                        />
                        <ExtraFields 
                            extraFields={this.state.extraFields}
                            fieldTypes={this.props.getFieldTypes()}
                            loaded={this.state.loaded}
                            handlers={extrasHandlers}
                        />
                        {snackbar}
                    </div>
                </Container>
            );
        }
        else if(this.state.action === 'edit') {
            return (
                <ExtraFieldEdit 
                    fieldBeingEditedId={this.state.fieldBeingEditedId}
                    fieldTypes={this.props.getFieldTypes()}
                    handlers={extrasEditHandlers}
                    snackbar={snackbar}
                />
            );
        }
    }
});

module.exports = SortWrapper(FieldsWrapper(FormContainer));