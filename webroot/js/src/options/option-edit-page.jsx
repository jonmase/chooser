import React from 'react';

import Formsy from 'formsy-react';
import RaisedButton from 'material-ui/RaisedButton';

import CancelDialog from './option-edit-cancel-dialog.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import DefaultFields from '../elements/fields/option-fields/default-fields.jsx';
import ExtraField from '../elements/fields/option-fields/extra-field.jsx';

var saveButtonDefaults = {
    enabled: true,
    label: 'Save',
};

var OptionEditPage = React.createClass({
    getInitialState: function () {
        var initialState = {
            cancelDialogOpen: false,
            canSaveOption: false,
            dirty: false,
            saveButton: saveButtonDefaults,
        };
        
        return initialState;
    },
    
    cancel: function() {
        this.setState({
            cancelDialogOpen: false,
            dirty: false,
        });
        this.props.optionContainerHandlers.backToEdit();
    },
    
    disableSaveButton: function() {
        this.setState({
            canSaveOption: false,
        });
    },
    
    enableSaveButton: function() {
        this.setState({
            canSaveOption: true,
        });
    },

    //Handle click on the back button - warn if form is dirty
    handleBackButtonClick: function() {
        //If the form is dirty...
        if(this.state.dirty) {
            //...check that user definitely wants to cancel and lose changes
            this.setState({
                cancelDialogOpen: true,
            });
        }
        //Otherwise, just go back to editing index page
        else {
            this.props.optionContainerHandlers.backToEdit();
        }
    },
    
    //Close the cancel confirm dialog
    handleCancelDialogClose: function() {
        this.setState({
            cancelDialogOpen: false,
        });
    },
    
    //Handle changes to form fields
    handleChange: function() {
        //If option is not yet dirty, set it to be
        if(!this.state.dirty) {
            this.setState({
                dirty: true,
            });
        }
    },
    
    //Handle changes to WYSIWYG form fields
    handleChangeWysiwyg: function(element, value) {
        this.handleChange();
        this.props.optionContainerHandlers.wysiwygChange(element, value);
    },
    
    //When Save button is clicked, submit the edit form
    handleSaveButtonClick: function() {
        this.refs.edit.submit();
    },
    
    //Submit the edit option form
    handleSubmit: function (option) {
        this.setState({
            saveButton: {
                enabled: false,
                label: 'Saving',
            },
        });

        //Get the alloy editor data
        if(this.props.choice.use_description) {
            option.description = this.props.optionValues.value_description;
        }
        for(var extra in this.props.choice.extra_fields) {
            var field = this.props.choice.extra_fields[extra];
            if(field.type === 'wysiwyg') {
                option[field.name] = this.props.optionValues['value_' + field.name];
            }
        }
        
        if(this.props.optionEditing.optionBeingEdited) {
            option.choices_option_id = this.props.optionEditing.optionBeingEdited;
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

                this.setState({
                    dirty: false,
                    saveButton: saveButtonDefaults,
                });
                
                this.props.optionContainerHandlers.handleReturnedData(returnedData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    saveButton: {
                        enabled: true,
                        label: 'Resave',
                    },
                });
                
                this.props.optionContainerHandlers.handleError(err);
            }.bind(this)
        });
    },

    render: function() {
        var defaults = {
            code: this.props.choice.use_code,
            title: this.props.choice.use_title,
            description: this.props.choice.use_description,
            min_places: this.props.choice.use_min_places,
            max_places: this.props.choice.use_max_places,
            points: this.props.choice.use_points,
        };
        
        var option = {};
        if(this.props.optionEditing.optionBeingEdited) {
            option = this.props.options.options[this.props.options.indexesById[this.props.optionEditing.optionBeingEdited]];
        }

        var topbar = <TopBar 
            iconLeft={<TopBarBackButton onTouchTap={this.handleBackButtonClick} />}
            iconRight={<RaisedButton 
                disabled={!this.state.canSaveOption || !this.state.saveButton.enabled}
                //disabled={!this.state.saveButton.enabled}
                label={this.state.saveButton.label}
                onTouchTap={this.handleSaveButtonClick}
                //primary={true}
                style={{marginTop: '6px'}}
                type="submit"
            />}
            title="Edit Option"
        />;
        
        return (
            <Container topbar={topbar} title={null}>
                <Formsy.Form 
                    id="option_form"
                    method="POST"
                    noValidate={true}
                    onValid={this.enableSaveButton}
                    onInvalid={this.disableSaveButton}
                    onValidSubmit={this.handleSubmit}
                    ref="edit"
                >
                    <div className="section">
                        <DefaultFields
                            defaults={defaults}
                            option={option}
                            removeOrHide="remove"
                            onChange={this.handleChange}
                            onWysiwygChange={this.handleChangeWysiwyg}
                        />
                    </div>
                    <div className="section">
                        {this.props.choice.extra_fields.map(function(field) {
                            if(field.type === 'wysiwyg') {
                                field.onChange = this.handleChangeWysiwyg;
                            }
                            else {
                                field.onChange = this.handleChange;
                            }
                            if(option && typeof(option[field.name]) !== "undefined") {
                                field.value = option[field.name];
                            }
                            else {
                                //delete field.value;
                                field.value = '';
                            }
                            
                            return (
                                <ExtraField
                                    key={field.id}
                                    field={field}
                                />
                            );
                        }, this)}
                    </div>
                </Formsy.Form>
                <CancelDialog 
                    handlers={{
                        close: this.handleCancelDialogClose,
                        submit: this.cancel,
                    }}
                    open={this.state.cancelDialogOpen}
                />
            </Container>
        );
    }
});

module.exports = OptionEditPage;