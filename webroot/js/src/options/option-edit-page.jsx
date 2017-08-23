import React from 'react';
import update from 'immutability-helper';

import Formsy from 'formsy-react';
import RaisedButton from 'material-ui/RaisedButton';

import WarningDialog from './option-edit-approved-warning-dialog.jsx';
import CancelDialog from './option-edit-cancel-dialog.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';
import Alert from '../elements/alert.jsx';

import DefaultFields from '../elements/fields/option-fields/default-fields.jsx';
import ExtraField from '../elements/fields/option-fields/extra-field.jsx';
import FieldsWrapper from '../elements/wrappers/fields.jsx';

var buttonLabels = {
    save: {
        default: 'Save',
        retry: 'Retry Save',
        working: 'Saving',
    },
    publish: {
        default: 'Save & Publish',
        retry: 'Retry Save & Publish',
        working: 'Saving & Publishing',
    },
    reapprove: {
        default: 'Save & Reapprove',
        retry: 'Retry Save & Reapprove',
        working: 'Saving & Reapproving',
    },
    republish: {
        default: 'Save & Republish',
        retry: 'Retry Save & Republish',
        working: 'Saving & Republishing',
    },
}

var OptionEditPage = React.createClass({
    getInitialState: function () {
        var initialState = {
            cancelDialogOpen: false,
            canSaveOption: false,
            dirty: false,
            saveButtonEnabled: true,
            saveButtonLabel: buttonLabels.save.default,
            saveAndPublish: false,
            savePublishButtonType: 'publish',
            warningDialogOpen: false,
            wysiwygEditors: {},
        };
        
        var option = this.getOption();
        if(option.published) {
            if(this.isApprovalRequired() && option.approved && this.isApprover()) {
                initialState.savePublishButtonType = 'reapprove';
            }
            else {
                initialState.savePublishButtonType = 'republish';
            }
        }
        
        initialState.savePublishButtonLabel = buttonLabels[initialState.savePublishButtonType].default;
        
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

    getOption: function() {
        var option = {};
        if(this.props.optionEditing.optionBeingEdited) {
            option = this.props.options.options[this.props.options.indexesById[this.props.optionEditing.optionBeingEdited]];
        }

        return option;
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
    
    //When focussing on WYSIWYG field, set the form to dirty and make sure WYSWIGY is activated
    handleWysiwygFocus: function(fieldName, editor) {
        this.handleChange();
        if(typeof(this.state.wysiwygEditors[fieldName]) === "undefined") {
            var wysiwygEditorsState = this.state.wysiwygEditors;
            var newWysiwygEditorsState = update(wysiwygEditorsState, {
                [fieldName]: {$set: editor},
            });
            this.setState({wysiwygEditors: newWysiwygEditorsState});
        }
    },
    
    handleSave: function(publishing) {
        if(typeof(publishing) === "undefined") {
            publishing = false;
        }
        //Check that form is dirty
        if(this.state.dirty) {
            var option = this.getOption();
            //If publishing, editing an approved option and not an approver, show the warning dialog
            if(this.isApprovalRequired() && publishing && !this.isApprover() && option.approved === true) {
                this.setState({
                    warningDialogOpen: true,
                });
            }
            else {
                this.submitForm(publishing); //Submit form
            }
        }
        //If form is not dirty, do nothing except show snackbar message
        else {
            this.props.optionContainerHandlers.snackbarOpen("Can't save, no changes made")
        }
    },
    
    handleSaveButtonClick: function() {
        this.handleSave(false);
    },
    
    handleSavePublishButtonClick: function() {
        this.handleSave(true);
    },
    
    //Submit the edit option form
    handleSubmit: function (option) {
        var newState = {
            saveButtonEnabled: false,
        };
        if(this.state.saveAndPublish) {
            option.published = true;
            newState.saveButtonLabel = buttonLabels.save.default;
            newState.savePublishButtonLabel = buttonLabels[this.state.savePublishButtonType].working;
        }
        else {
            newState.saveButtonLabel = buttonLabels.save.working;
            newState.savePublishButtonLabel = buttonLabels[this.state.savePublishButtonType].default;
        }
    
        this.setState(newState);

        //Get the alloy editor data

        if(this.props.choice.use_description) {
            var editor = this.state.wysiwygEditors['description'];
            if(typeof(editor) !== "undefined") {
                option.description = editor.getData();
            }
            //option.description = this.props.optionValues.value_description;
        }
        for(var extra in this.props.choice.extra_fields) {
            var field = this.props.choice.extra_fields[extra];
            if(field.type === 'wysiwyg') {
                var editor = this.state.wysiwygEditors[field.name];
                if(typeof(editor) !== "undefined") {
                    option[field.name] = editor.getData();
                }
                //option[field.name] = this.props.optionValues['value_' + field.name];
            }
        }
        
        if(this.props.optionEditing.optionBeingEdited) {
            option.choices_option_id = this.props.optionEditing.optionBeingEdited;
        }
        
        
        //Save the settings
        var url = 'save';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: option,
            success: function(returnedData) {
                console.log(returnedData.response);

                this.setState({
                    dirty: false,
                    saveButtonEnabled: true,
                    saveButtonLabel: buttonLabels.save.default,
                    savePublishButtonLabel: buttonLabels[this.state.savePublishButtonType].default,
                });
                
                this.props.optionContainerHandlers.handleReturnedData(returnedData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    saveButtonEnabled: true,
                    saveButtonLabel: buttonLabels.save.retry,
                    savePublishButtonLabel: buttonLabels[this.state.savePublishButtonType].retry,
                });
                
                this.props.optionContainerHandlers.handleError(err);
            }.bind(this)
        });
    },
    
    handleWarningDialogClose: function() {
        this.setState({
            warningDialogOpen: false,
        });
    },

    handleWarningDialogSubmit: function() {
        this.setState({
            warningDialogOpen: false,
        }, this.submitForm(true));  //Submit form, republishing option
    },

    isApprovalRequired: function() {
        if(this.props.editingInstance.approval_required) {
            return true;
        }
        else {
            return false;
        }
    },
    
    isApprover: function() {
        if(this.props.roles.indexOf('admin') > -1 || this.props.roles.indexOf('approver') > -1) {
            return true;
        }
        else {
            return false;
        }
    },
    
    submitForm: function(saveAndPublish) {
        this.setState({
            saveAndPublish: saveAndPublish,
        }, this.refs.edit.submit);
    },
    
    render: function() {
        var option = this.getOption();

        var buttonsDisabled = !this.state.canSaveOption || !this.state.saveButtonEnabled || !this.state.dirty;
        var topbar = <TopBar 
            iconLeft={<TopBarBackButton onTouchTap={this.handleBackButtonClick} />}
            iconRight={
                <span>
                    <span style={{color: 'white', marginRight: '10px'}}>
                        {
                            this.state.canSaveOption?
                                (!this.state.dirty&&<span>No changes</span>)
                            :
                                <span>Incomplete or invalid form</span>
                        }
                    </span>
                    
                    {!option.published && 
                        <RaisedButton 
                            disabled={buttonsDisabled}
                            //disabled={!this.state.saveButtonEnabled}
                            label={this.state.saveButtonLabel}
                            onTouchTap={this.handleSaveButtonClick}
                            //primary={true}
                            style={{marginTop: '6px', marginRight: '12px'}}
                            type="submit"
                        />
                    }
                    <RaisedButton 
                        disabled={buttonsDisabled}
                        label={this.state.savePublishButtonLabel}
                        onTouchTap={this.handleSavePublishButtonClick}
                        //primary={true}
                        style={{marginTop: '6px'}}
                        type="submit"
                    />
                </span>
            }
            title={(this.props.optionEditing.optionBeingEdited?"Edit":"Add") + " Option"}
        />;
        
        if(option.approver_comments !== null) {
            if(option.approver_comments) {
                var approverComments = ", with the following comments: " + option.approver_comments;
            }
            else {
                var approverComments = ", without any comments";
            }
        }
        
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
                    {
                        this.isApprovalRequired()?
                            option.approved === false?
                                <Alert>
                                    This option has been rejected{approverComments}.
                                </Alert>
                            :
                                option.approved === null?
                                    option.approver_comments !== null?
                                        <Alert>
                                            A previous version of this option was rejected{approverComments}.
                                        </Alert>
                                    :
                                        option.approver !== null &&
                                            <Alert>
                                                A previous version of this option was approved.
                                            </Alert>
                                :
                                    option.approved === true&&
                                        this.isApprover()?
                                            <Alert>
                                                This option has already been approved and will be visible to students if/when the Choice is open. As you are an Approver, changes you make will be approved and visible to students after you save.
                                            </Alert>
                                        :
                                            <Alert>
                                                This option has been approved and will be visible to students if/when the Choice is open. If you make changes, the option will need to be reapproved before it is visible again. 
                                            </Alert>
                        :
                            option.published && 
                                <Alert>
                                    This option has already been published and will be visible to students if/when the Choice is open. Any changes you make will also be visible to students after you save.
                                </Alert>
                    }
                    
                    <div className="section">
                        <DefaultFields
                            defaultFields={this.props.getDefaultFieldsForChoice(this.props.choice)}
                            option={option}
                            removeOrHide="remove"
                            onWysiwygBlur={this.handleWysiwygBlur}
                            onChange={this.handleChange}
                            onWysiwygFocus={this.handleWysiwygFocus}
                        />
                    </div>
                    <div className="section">
                        {this.props.choice.extra_fields.map(function(field) {
                            //If field is WYSIWYG, add editor to state and assume it is changed on focus 
                            if(field.type === 'wysiwyg') {
                                field.onFocus = this.handleWysiwygFocus;
                            }
                            //If this is a text type field, i.e. where user will be typing, assume it is changed on focus
                            else if(this.props.textFieldTypes.indexOf(field.type) > -1) {
                                field.onFocus = this.handleChange;
                            }
                            //Otherwise, set as changed when it changes
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
                <WarningDialog 
                    handlers={{
                        close: this.handleWarningDialogClose,
                        submit: this.handleWarningDialogSubmit,
                    }}
                    open={this.state.warningDialogOpen}
                />
                <CancelDialog 
                    handlers={{
                        close: this.handleCancelDialogClose,
                        submit: this.cancel,
                    }}
                    open={this.state.cancelDialogOpen}
                />
                {this.props.snackbar}
            </Container>
        );
    }
});

module.exports = FieldsWrapper(OptionEditPage);