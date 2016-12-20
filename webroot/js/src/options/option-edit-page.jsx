import React from 'react';

import FlatButton from 'material-ui/FlatButton';

import Formsy from 'formsy-react';

import DefaultFields from '../elements/fields/option-fields/default-fields.jsx';
import ExtraField from '../elements/fields/option-fields/extra-field.jsx';

var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var OptionEditPage = React.createClass({
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
        /*var actions = [
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
        ];*/
        
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
            <Formsy.Form 
                id="option_form"
                method="POST"
                noValidate={true}
                onValid={this.enableSubmitButton}
                onInvalid={this.disableSubmitButton}
                onValidSubmit={this.props.optionContainerHandlers.submit}
            >
                <div className="section">
                    <DefaultFields
                        defaults={defaults}
                        option={option}
                        removeOrHide="remove"
                        onWysiwygChange={this.props.optionContainerHandlers.wysiwygChange}
                    />
                </div>
                <div className="section">
                    {this.props.choice.extra_fields.map(function(field) {
                        if(field.type === 'wysiwyg') {
                            field.onChange = this.props.optionContainerHandlers.wysiwygChange;
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
        );
    }
});

module.exports = OptionEditPage;