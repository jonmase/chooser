import React from 'react';

import FlatButton from 'material-ui/FlatButton';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FormsyDialog from '../elements/formsy-dialog.jsx';
import FieldLabel from '../elements/label.jsx';
import Text from '../fields/text.jsx';
import Wysiwyg from '../fields/wysiwyg.jsx';
import DateTime from '../fields/datetime.jsx';
import Dropdown from '../fields/dropdown.jsx';
import Hidden from '../fields/hidden.jsx';


var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var RuleDialog = React.createClass({
    getInitialState: function () {
        var instance = this.props.state.instance;
        return {
            preferenceType: rule.type || 'number',
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
    
    handleRuleTypeChange: function(event, value) {
        this.setState({
            preferenceType: value
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
                label={this.props.state.ruleSaveButtonLabel}
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit || !this.props.state.ruleSaveButtonEnabled}
            />,
        ];
        
        var instance = this.props.state.instance;
        
        return (
            <FormsyDialog
                actions={actions}
                contentStyle={customDialogStyle}
                dialogOnRequestClose={this.props.handlers.dialogClose}
                dialogOpen={this.props.state.ruleDialogOpen}
                dialogTitle="Edit Settings"
                formId="rule_form"
                formOnValid={this.enableSubmitButton}
                formOnInvalid={this.disableSubmitButton}
                formOnValidSubmit={this.props.handlers.submit}
            >
                <Dropdown field={{
                        label: "Rule Type",
                        name: "type",
                        options: [
                            {
                                label: "Number",
                                value: "number",
                            },
                            {   
                                label: "Points",
                                value: "points",
                            },
                            {   
                                label: "Related",
                                value: "related",
                            }
                        ],
                        section: true, 
                        value:  this.state.ruleType,
                    }} 
                    onChange={this.handleRuleTypeChange}
                />
                <Dropdown field={{
                        label: "Rule Scope",
                        name: "type",
                        options: [
                            {
                                label: "Entire Choice",
                                value: "number",
                            },
                            {   
                                label: "Category",
                                value: "points",
                            },
                            {   
                                label: "Related",
                                value: "related",
                            }
                        ],
                        section: true, 
                        value:  this.state.ruleType,
                    }} 
                    onChange={this.handleRuleTypeChange}
                />
                <div id="instructions">
                    <Wysiwyg field={{
                        label: "Instructions",
                        instructions: "Provide instructions for the students on fulfilling this rule.",
                        name: "rule_instructions",
                        onChange: this.props.handlers.wysiwygChange,
                        section: true,
                        value: rule.instructions || null,
                    }} />
                </div>
                <div className="section" id="hard">
                    <FormsyToggle
                        defaultToggled={(typeof(rule.hard) !== "undefined")?instance.hard:true}
                        label="Hard rule? Students cannot submit if they do not fulfil a hard rule. They will always get a warning if they do not fulfil a rule."
                        labelPosition="right"
                        name="hard"
                    />
                </div>
            </FormsyDialog>
        );
    }
});

module.exports = RuleDialog