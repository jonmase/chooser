import React from 'react';

import FlatButton from 'material-ui/FlatButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';
import DefaultFields from '../elements/fields/option-fields/default-fields.jsx';
import ExtraField from '../elements/fields/option-fields/extra-field.jsx';

var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var OptionEditDialog = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
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

    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.dialogClose}
            />,
            <FlatButton
                key="submit"
                label={this.props.optionSaveButton.label}
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit || !this.props.optionSaveButton.enabled}
            />,
        ];
        
        var option = {};
        if(this.props.optionEditing.optionBeingEdited) {
            option = this.props.options.options[this.props.options.indexesById[this.props.optionEditing.optionBeingEdited]];
        }

        return (
            <FormsyDialog
                actions={actions}
                contentStyle={customDialogStyle}
                dialogOnRequestClose={this.props.handlers.dialogClose}
                dialogOpen={this.props.optionEditing.dialogOpen}
                dialogTitle={this.props.optionEditing.dialogTitle}
                formId="option_form"
                formOnValid={this.enableSubmitButton}
                formOnInvalid={this.disableSubmitButton}
                formOnValidSubmit={this.props.handlers.submit}
            >
                <div className="section">
                    <DefaultFields
                        choice={this.props.choice}
                        option={option}
                        removeOrHide="remove"
                        onWysiwygChange={this.props.handlers.wysiwygChange}
                    />
                </div>
                <div className="section">
                    {this.props.choice.extra_fields.map(function(field) {
                        if(field.type === 'wysiwyg') {
                            field.onChange = this.props.handlers.wysiwygChange;
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
            </FormsyDialog>
        );
    }
});

module.exports = OptionEditDialog;