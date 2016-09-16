import React from 'react';

import FlatButton from 'material-ui/FlatButton';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FormsyDialog from '../elements/formsy-dialog.jsx';
import FieldLabel from '../elements/fields/label.jsx';

import Text from '../elements/fields/text.jsx';
import Wysiwyg from '../elements/fields/wysiwyg.jsx';
import DateTime from '../elements/fields/datetime.jsx';
import Dropdown from '../elements/fields/dropdown.jsx';
import Hidden from '../elements/fields/hidden.jsx';
import Numeric from '../elements/fields/numeric.jsx';
import Checkbox from '../elements/fields/checkbox.jsx';
import Radio from '../elements/fields/radio.jsx';


var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var RuleDialog = React.createClass({
    getInitialState: function () {
        return {
            ruleCategoryFieldIndex: null,
            ruleCategoryFieldOptionIndex: null,
            //ruleCategoryFieldOptionIndexes: [],
            ruleScope: 'choice',//rule.type || 'number',
            ruleType: 'number_range',//rule.type || 'number',
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
    
    handleRuleCategoryFieldChange: function(event, value) {
        this.setState({
            ruleCategoryFieldIndex: value,
            ruleCategoryFieldOptionIndex: null,
        });
    },

    handleRuleCategoryFieldOptionChange: function(event, value) {
        this.setState({
            ruleCategoryFieldOptionIndex: value,
        });
    },

    handleRuleScopeChange: function(event, value) {
        this.setState({
            ruleScope: value,
            ruleCategoryFieldIndex: null,
            ruleCategoryFieldOptionIndex: null,
        });
    },

    handleRuleTypeChange: function(event, value) {
        this.setState({
            ruleType: value
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
                label={this.props.containerState.ruleSaveButtonLabel}
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit || !this.props.containerState.ruleSaveButtonEnabled}
            />,
        ];
        
        var rule = [];
        
        var allOptionsArray = [
            {value: 'all', label: 'All Options'}
        ];
        
        return (
            <FormsyDialog
                actions={actions}
                contentStyle={customDialogStyle}
                dialogOnRequestClose={this.props.handlers.dialogClose}
                dialogOpen={this.props.containerState.ruleEditDialogOpen}
                dialogTitle="Edit Rule"
                formId="rule_form"
                formOnValid={this.enableSubmitButton}
                formOnInvalid={this.disableSubmitButton}
                formOnValidSubmit={this.props.handlers.submit}
            >
                <Text 
                    field={{
                        label: "Name*",
                        instructions: "Enter name",
                        name: "name",
                        section: true,
                        required: true,
                        value: rule.name,
                    }}
                />
                <Wysiwyg field={{
                    label: "Instructions",
                    instructions: "Provide instructions for the students on fulfilling this rule.",
                    name: "instructions",
                    onChange: this.props.handlers.wysiwygChange,
                    section: true,
                    value: null //rule.instructions || null,
                }} />
                <Wysiwyg field={{
                    label: "Warning Message",
                    instructions: "This message will be shown to students if they fail to fulfil this rule.",
                    name: "warning",
                    onChange: this.props.handlers.wysiwygChange,
                    section: true,
                    value: null //rule.instructions || null,
                }} />
                <div className="section" id="hard">
                    <FormsyToggle
                        defaultToggled={(typeof(rule.hard) !== "undefined")?rule.hard:true}
                        label="Hard rule? Students cannot submit if they do not fulfil a hard rule. They will always get a warning if they do not fulfil a rule, but can still submit if it is a soft rule."
                        labelPosition="right"
                        name="hard"
                    />
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <Dropdown 
                            field={{
                                label: "Rule Type",
                                name: "type",
                                options: [
                                    {
                                        label: "Number - Min and/or Max",
                                        value: "number_range",
                                    },
                                    {
                                        label: "Number - Specific Values",
                                        value: "number_values",
                                    },
                                    {   
                                        label: "Points - Min and/or Max",
                                        value: "points_range",
                                    },
                                    {   
                                        label: "Points - Specific Values",
                                        value: "points_values",
                                    },
                                    /*{   
                                        label: "Related",
                                        value: "related",
                                    }*/
                                ],
                                section: false, 
                                value:  this.state.ruleType,
                            }} 
                            onChange={this.handleRuleTypeChange}
                        />
                        {(this.state.ruleType === "number_range" || this.state.ruleType === "points_range")?
                            <div>
                                <Numeric
                                    field={{
                                        instructions: "Enter minimum",
                                        label: "Minimum",
                                        name: "number_min",
                                        section: false, 
                                       // value: rule.number_min,
                                    }}
                                />
                                <Numeric
                                    field={{
                                        instructions: "Enter maximum",
                                        label: "Maximum",
                                        name: "number_max",
                                        section: true, 
                                        //value: rule.number_max,
                                    }}
                                />
                            </div>
                        :
                            <div>
                                <Text
                                    field={{
                                        instructions: "Comma-separated, e.g. 3, 5, 8",
                                        label: "Possible Values",
                                        name: "values",
                                        section: true, 
                                        //value: rule.values,
                                    }}
                                />
                            </div>
                        }
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Dropdown 
                            field={{
                                label: "Rule Scope",
                                name: "scope",
                                options: [
                                    {
                                        label: "Entire Choice",
                                        value: "choice",
                                    },
                                    {   
                                        label: "Category",
                                        value: "category",
                                    },
                                ],
                                section: false, 
                                value:  this.state.ruleScope,
                            }} 
                            onChange={this.handleRuleScopeChange}
                        />
                        {(this.state.ruleScope === "category")?
                            <div>
                                <Dropdown 
                                    field={{
                                        label: "Category Field",
                                        name: "category_field",
                                        options: this.props.containerState.ruleCategoryFields,
                                        section: true, 
                                        value:  this.state.ruleCategoryFieldIndex,
                                    }} 
                                    onChange={this.handleRuleCategoryFieldChange}
                                />
                                {(this.state.ruleCategoryFieldIndex !== null)?
                                    /*<Checkbox 
                                        field={{
                                            instructions: "Select the option categories that you would like this rule to apply to.",
                                            label: "Categories",
                                            name: "categories",
                                            options: this.props.containerState.ruleCategoryFields[this.state.ruleCategoryFieldIndex].extra_field_options,
                                            section: true, 
                                            value:  this.state.ruleCategoryFieldOptionIndexes,
                                        }} 
                                        onChange={this.handleRuleCategoryFieldOptionChange}
                                    />*/
                                    <Radio 
                                        field={{
                                            instructions: "Select the option category that you would like this rule to apply to.",
                                            label: "Categories",
                                            name: "categories",
                                            options: allOptionsArray.concat(this.props.containerState.ruleCategoryFields[this.state.ruleCategoryFieldIndex].extra_field_options),
                                            section: true, 
                                            value:  this.state.ruleCategoryFieldOptionIndex,
                                        }} 
                                        onChange={this.handleRuleCategoryFieldOptionChange}
                                    />
                                :""}
                                
                            </div>
                        :
                            <p>This rule will be applied across all of the options.</p>
                        }
                    </div>
                </div>
            </FormsyDialog>
        );
    }
});

module.exports = RuleDialog