import React from 'react';

import Formsy from 'formsy-react';
import RaisedButton from 'material-ui/RaisedButton';

import CancelDialog from './option-edit-cancel-dialog.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/icons/topbar-back-button.jsx';

import DefaultFields from '../elements/fields/option-fields/default-fields.jsx';
import ExtraField from '../elements/fields/option-fields/extra-field.jsx';

var OptionEditPage = React.createClass({
    getInitialState: function () {
        var initialState = {
            cancelDialogOpen: false,
            canSaveOption: false,
            dirty: false,
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
    
    handleCancelDialogClose: function() {
        //Close the cancel confirm dialog
        this.setState({
            cancelDialogOpen: false,
        });
    },
    
    handleChange: function() {
        //If option is not yet dirty, set it to be
        if(!this.state.dirty) {
            this.setState({
                dirty: true,
            });
        }
    },
    
    handleWysiwygChange: function(element, value) {
        this.handleChange();
        this.props.optionContainerHandlers.wysiwygChange(element, value);
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
                disabled={!this.state.canSaveOption || !this.props.optionSaveButton.enabled}
                //disabled={!this.props.optionSaveButton.enabled}
                label={this.props.optionSaveButton.label}
                onTouchTap={this.props.optionContainerHandlers.save}
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
                    onValidSubmit={this.props.optionContainerHandlers.submit}
                >
                    <div className="section">
                        <DefaultFields
                            defaults={defaults}
                            option={option}
                            removeOrHide="remove"
                            onChange={this.handleChange}
                            onWysiwygChange={this.handleWysiwygChange}
                        />
                    </div>
                    <div className="section">
                        {this.props.choice.extra_fields.map(function(field) {
                            if(field.type === 'wysiwyg') {
                                field.onChange = this.handleWysiwygChange;
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