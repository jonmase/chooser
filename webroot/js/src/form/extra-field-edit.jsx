import React from 'react';

import Formsy from 'formsy-react';

import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import DropdownField from '../elements/fields/dropdown.jsx';
import CommonFields from './extra-common-fields.jsx';
import TypeSpecificFields from './extra-type-specific-fields.jsx';

import AddButton from '../elements/buttons/add-button.jsx';
import AddButtonRaised from '../elements/buttons/add-button-raised.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';
import DeleteButton from '../elements/buttons/delete-button.jsx';

var ExtraFieldEditPage = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            saveButtonEnabled: true,
            saveButtonLabel: 'Save',
            type: null,
        };
    },

    enableSubmitButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false
        });
    },

    handleTypeChange: function (event, value) {
        console.log("Field type changed to " + value);
        this.setState({
            type: value,
        });
    },

    handleSaveClick: function() {
        //Submit the form by ref
        this.refs.extra.submit();
    },
    
    //Submit the form
    handleSubmit: function (field) {
        field.id = this.state.editExtraFieldId;
        console.log("Saving extra field: ", field);
        
        //Save the settings
        var url = '../ExtraFields/save/';
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

    render: function() {
        var edit = this.props.fieldBeingEditedId?true:false;
        if(edit) {
            var title = "Edit Extra Field";
            var field = this.props.handlers.getField(this.props.fieldBeingEditedId);
        }
        else {
            var title = "Add Extra Field";
            var field = {};
        }
    
        var topbar = <TopBar 
            iconLeft={<TopBarBackButton onTouchTap={this.props.handlers.backButtonClick} />}
            iconRight={<RaisedButton 
                disabled={!this.state.canSubmit && this.state.saveButtonEnabled}
                label={this.state.saveButtonLabel}
                onTouchTap={this.handleSaveClick}
                style={{marginTop: '6px'}}
            />}
            title={title}
        />;
        
        return (
            <Container topbar={topbar}>
                <Formsy.Form
                    id="extra_field_form"
                    method="POST"
                    onValid={this.enableSubmitButton}
                    onInvalid={this.disableSubmitButton}
                    onValidSubmit={this.handleSubmit}
                    noValidate={true}
                    ref="extra"
                >
                    {edit?
                        <p>
                            <strong>Type:</strong> {field.type.label} <br />
                            <span className="sublabel">(You can't change this. If you want to change the field type, you will have to delete this field and then add the new one.)</span>
                        </p>
                    :
                        <div>
                            <p className="no-bottom-margin">Select the type of field that you want to add, and then complete the additional details.</p>
                            <DropdownField
                                field={{
                                    label: "Field type",
                                    name: "type",
                                    onChange: this.handleTypeChange,
                                    options: this.props.fieldTypes,
                                    required: true,
                                }}
                            />
                        </div>
                    }
                    <CommonFields
                        type={edit?field.type:this.state.type}
                        values={edit?field:{}}
                    />
                    <TypeSpecificFields
                        type={edit?field.type:this.state.type}
                        values={edit?field:{}}
                    />
                </Formsy.Form>
                {this.props.snackbar}
            </Container>
        );
    }
});

module.exports = ExtraFieldEditPage;