import React from 'react';

import FlatButton from 'material-ui/FlatButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';
import FieldLabel from '../elements/label.jsx';
import DefaultFields from '../options-form/default-fields.jsx';
import ExtraField from '../options-form/extra-field.jsx';

var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var OptionDialog = React.createClass({
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
                label={this.props.state.optionSaveButtonLabel}
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit || !this.props.state.optionSaveButtonEnabled}
            />,
        ];
        
        var defaults = {
            code: this.props.choice.use_code,
            title: this.props.choice.use_title,
            description: this.props.choice.use_description,
            min_places: this.props.choice.use_min_places,
            max_places: this.props.choice.use_max_places,
            points: this.props.choice.use_points,
        };
        
        var optionBeingEdited = this.props.state.optionBeingEdited;

        return (
            <FormsyDialog
                actions={actions}
                contentStyle={customDialogStyle}
                dialogOnRequestClose={this.props.handlers.dialogClose}
                dialogOpen={this.props.state.optionDialogOpen}
                dialogTitle={this.props.state.optionDialogTitle}
                formId="option_form"
                formOnValid={this.enableSubmitButton}
                formOnInvalid={this.disableSubmitButton}
                formOnValidSubmit={this.props.handlers.submit}
            >
                <div className="section">
                    <DefaultFields
                        defaults={defaults}
                        removeOrHide="remove"
                        option={optionBeingEdited}
                    />
                </div>
                <div className="section">
                    {this.props.choice.extra_fields.map(function(field) {
                        if(field.type === 'wysiwyg') {
                            field.onChange = this.props.handlers.wysiwygChange;
                        }
                        if(optionBeingEdited && typeof(optionBeingEdited[field.name]) !== "undefined") {
                            field.value = optionBeingEdited[field.name];
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

module.exports = OptionDialog;