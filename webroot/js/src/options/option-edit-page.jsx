import React from 'react';

import Formsy from 'formsy-react';

import CancelDialog from './option-edit-cancel-dialog.jsx';

import DefaultFields from '../elements/fields/option-fields/default-fields.jsx';
import ExtraField from '../elements/fields/option-fields/extra-field.jsx';

var OptionEditPage = React.createClass({
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

        return (
            <div>
                <Formsy.Form 
                    id="option_form"
                    method="POST"
                    noValidate={true}
                    onValid={this.props.optionContainerHandlers.enableSaveButton}
                    onInvalid={this.props.optionContainerHandlers.disableSaveButton}
                    onValidSubmit={this.props.optionContainerHandlers.submit}
                >
                    <div className="section">
                        <DefaultFields
                            defaults={defaults}
                            option={option}
                            removeOrHide="remove"
                            onChange={this.props.optionContainerHandlers.change}
                            onWysiwygChange={this.props.optionContainerHandlers.wysiwygChange}
                        />
                    </div>
                    <div className="section">
                        {this.props.choice.extra_fields.map(function(field) {
                            if(field.type === 'wysiwyg') {
                                field.onChange = this.props.optionContainerHandlers.wysiwygChange;
                            }
                            else {
                                field.onChange = this.props.optionContainerHandlers.change;
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
                        close: this.props.optionContainerHandlers.cancelDialogClose,
                        submit: this.props.optionContainerHandlers.backToEdit,
                    }}
                    open={this.props.cancelDialogOpen}
                />
            </div>
        );
    }
});

module.exports = OptionEditPage;