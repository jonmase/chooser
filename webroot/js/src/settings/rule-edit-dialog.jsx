import React from 'react';

import FlatButton from 'material-ui/FlatButton';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FormsyDialog from '../elements/formsy-dialog.jsx';
import FieldLabel from '../elements/fields/label.jsx';

import Text from '../elements/fields/text.jsx';
//import Wysiwyg from '../elements/fields/wysiwyg.jsx';
import DateTime from '../elements/fields/datetime.jsx';
import Dropdown from '../elements/fields/dropdown.jsx';
import Hidden from '../elements/fields/hidden.jsx';
import Number from '../elements/fields/number.jsx';
import Checkbox from '../elements/fields/checkbox.jsx';
import Radio from '../elements/fields/radio.jsx';


var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var RuleDialog = React.createClass({
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
                onTouchTap={this.props.handlers.editDialogClose}
            />,
            <FlatButton
                key="submit"
                label={this.props.containerState.ruleSaveButtonLabel}
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit || !this.props.containerState.ruleSaveButtonEnabled}
            />,
        ];
        
        if(this.props.containerState.ruleBeingEdited) {
            var rule = this.props.containerState.rules[this.props.containerState.ruleIndexesById[this.props.containerState.ruleBeingEdited]];
            var title = 'Edit Rule'
        }
        else {
            var rule = {};
            var title = 'Add Rule'
        }
        
        var allOptionsArray = [
            {value: 'all', label: 'All Categories (the rule will apply to all the categories for this field)'}
        ];
        
        return (
            <FormsyDialog
                actions={actions}
                contentStyle={customDialogStyle}
                dialogOnRequestClose={this.props.handlers.editDialogClose}
                dialogOpen={this.props.containerState.ruleEditDialogOpen}
                dialogTitle={title}
                formId="rule_form"
                formOnValid={this.enableSubmitButton}
                formOnInvalid={this.disableSubmitButton}
                formOnValidSubmit={this.props.handlers.editSubmit}
            >
                <Hidden name="id" value={rule.id} />
                <Hidden name="type" value={this.props.containerState.ruleType} />
                <Hidden name="value_type" value={this.props.containerState.ruleValueType} />
                <Hidden name="choosing_instance_id" value={this.props.containerState.instance.id} />
                <Text 
                    field={{
                        label: "Name*",
                        instructions: "Enter name",
                        name: "name",
                        section: false,
                        required: true,
                        value: rule.name,
                    }}
                />
                <Text field={{
                    fullWidth: true,
                    label: "Instructions",
                    instructions: "Provide instructions for the students on fulfilling this rule.",
                    name: "instructions",
                    //onChange: this.props.handlers.wysiwygChange,
                    section: false,
                    value: rule.instructions,
                }} />
                <Text field={{
                    fullWidth: true,
                    label: "Warning Message",
                    instructions: "This message will be shown to students if they fail to fulfil this rule.",
                    name: "warning",
                    //onChange: this.props.handlers.wysiwygChange,
                    section: true,
                    value: rule.warning,
                }} />
                <p>
                    <strong>Please Note:</strong> If you do not provide instructions or a warning message, these will be generated using the rule details provided below.
                </p>
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
                                name: "combined_type",
                                onChange: this.props.handlers.typeChange,
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
                                value:  this.props.containerState.ruleCombinedType,
                            }} 
                        />
                        {(this.props.containerState.ruleValueType === "range")?
                            <div>
                                <Number
                                    field={{
                                        instructions: "Enter minimum",
                                        label: "Minimum",
                                        name: "min",
                                        section: false, 
                                        value: rule.min,
                                    }}
                                />
                                <Number
                                    field={{
                                        instructions: "Enter maximum",
                                        label: "Maximum",
                                        name: "max",
                                        section: true, 
                                        value: rule.max,
                                    }}
                                />
                            </div>
                        :
                            (this.props.containerState.ruleValueType === "values")?
                                <div>
                                    <Text
                                        field={{
                                            instructions: "Comma-separated, e.g. 3, 5, 8",
                                            label: "Possible Values",
                                            name: "allowed_values",
                                            section: true, 
                                            value: rule.allowed_values,
                                        }}
                                    />
                                </div>
                            :""
                        }
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <Dropdown 
                            field={{
                                label: "Rule Applies To",
                                name: "scope",
                                onChange: this.props.handlers.scopeChange,
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
                                value:  this.props.containerState.ruleScope,
                            }} 
                        />
                        {(this.props.containerState.ruleScope === "category")?
                            <div>
                                <Dropdown 
                                    field={{
                                        label: "Category Field",
                                        name: "category_field",
                                        onChange:this.props.handlers.categoryFieldChange,
                                        options: this.props.containerState.ruleCategoryFields,
                                        section: true, 
                                        value:  this.props.containerState.ruleCategoryFieldIndex,
                                    }} 
                                />
                                {(this.props.containerState.ruleCategoryFieldIndex !== null)?
                                    /*
                                    //TODO - Maybe use checkboxes and if multiple are selected, split it into separate rules when saving
                                    <Checkbox 
                                        field={{
                                            instructions: "Select the categories that you would like this rule to apply to.",
                                            label: "Categories",
                                            name: "categories",
                                            options: this.props.containerState.ruleCategoryFields[this.props.containerState.ruleCategoryFieldIndex].extra_field_options,
                                            section: true, 
                                            value:  this.props.containerState.ruleCategoryFieldOptionIndexes,
                                        }} 
                                        onChange={this.props.handlers.categoryFieldOptionChange}
                                    />*/
                                    <Radio 
                                        field={{
                                            instructions: "Select the category that you would like this rule to apply to. If you want it to apply to more than one category, but not all of them, you will need to create separate rules for each one.",
                                            label: "Categories",
                                            name: "category",
                                            options: allOptionsArray.concat(this.props.containerState.ruleCategoryFields[this.props.containerState.ruleCategoryFieldIndex].extra_field_options),
                                            section: true, 
                                            value:  this.props.containerState.ruleCategoryFieldOptionValue,
                                        }} 
                                        onChange={this.props.handlers.categoryFieldOptionChange}
                                    />
                                :""}
                                
                            </div>
                        :""}
                        {/*<p>This rule will be applied across all of the options.</p>*/}
                    </div>
                </div>
            </FormsyDialog>
        );
    }
});

module.exports = RuleDialog