import React from 'react';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import FieldLabel from '../elements/fields/label.jsx';
import Text from '../elements/fields/text.jsx';
//import Wysiwyg from '../elements/fields/wysiwyg.jsx';
import DateTime from '../elements/fields/datetime.jsx';
import Dropdown from '../elements/fields/dropdown.jsx';
import Hidden from '../elements/fields/hidden.jsx';
import Number from '../elements/fields/number.jsx';
import Checkbox from '../elements/fields/checkbox.jsx';
import Radio from '../elements/fields/radio.jsx';

var ruleDefaults = {
    type: 'number',
    valueType: 'range',
    combinedType: 'number_range',
    scope: 'choice',
    categoryFieldIndex: null,
    categoryFieldOptionValue: null,
};

var RuleEditor = React.createClass({
    getInitialState: function () {
        if(this.props.ruleBeingEdited !== null) {
            var rule = this.props.rules[this.props.ruleBeingEdited];
        }
        else {
            var rule = {};
        }
        
        if(rule.scope === 'category_all') {
            var scope = 'category';
        }
        else if(rule.scope) {
            var scope = rule.scope;
        }
        else {
            var scope = ruleDefaults.scope;
        }
        
        var categoryFieldIndex = ruleDefaults.categoryFieldIndex;
        var categoryFieldOptionValue = ruleDefaults.categoryFieldOptionValue;
        if(rule.extra_field_id) {
            this.props.ruleCategoryFields.some(function(field, index) {
                if(field.id === rule.extra_field_id) {
                    categoryFieldIndex = index;
                    return true;
                }
            }, this);
            
            if(rule.scope === 'category_all') {
                categoryFieldOptionValue = 'all';
            }
            else if(rule.extra_field_option_id) {
                this.props.ruleCategoryFields[categoryFieldIndex].extra_field_options.some(function(option, index) {
                    if(option.id === rule.extra_field_option_id) {
                        categoryFieldOptionValue = option.value;
                        return true;
                    }
                }, this);
            }
        }       
            
        return {
            canSubmit: false,
            categoryFieldIndex: categoryFieldIndex,
            categoryFieldOptionValue: categoryFieldOptionValue,
            combinedType: rule.combined_type?rule.combined_type:ruleDefaults.combinedType,
            saveButtonEnabled: true,
            saveButtonLabel: 'Save',
            scope: scope,
            type: rule.type?rule.type:ruleDefaults.type,
            valueType: rule.value_type?rule.value_type:ruleDefaults.valueType,
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
    
    handleCategoryFieldChange: function(event, value) {
        this.setState({
            categoryFieldIndex: value,
            categoryFieldOptionValue: null,
        });
    },

    handleCategoryFieldOptionChange: function(event, value) {
        this.setState({
            categoryFieldOptionValue: value,
        });
    },

    handleSaveClick: function() {
        //Submit the form by ref
        this.refs.rule.submit();
    },
    
    handleScopeChange: function(event, value) {
        this.setState({
            scope: value,
            categoryFieldIndex: null,
            categoryFieldOptionValue: null,
        });
    },

    handleSubmit: function(rule) {
        this.setState({
            saveButtonEnabled: false,
            saveButtonLabel: 'Saving',
        });

        //Get the IDs of the category field and option
        if(rule.scope === 'category') {
            var extraField = this.props.ruleCategoryFields[rule.category_field];
            rule.extra_field_id = extraField.id;
            
            if(rule.category === 'all') {
                rule.scope = 'category_all';
            }
            else {
                var option = extraField.extra_field_options.find(function(option) { return option.value === rule.category; });
                rule.extra_field_option_id = option.id;
            }
        }
        
        console.log("Saving rule: ", rule);
        
        //Save the Rule
        var url = '../rules/save/' + this.props.instance.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: rule,
            success: function(returnedData) {
                console.log(returnedData.response);

                this.setState({
                    saveButtonEnabled: true,
                    saveButtonLabel: 'Save',
                });
                
                this.props.handlers.success(returnedData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    saveButtonEnabled: true,
                    saveButtonLabel: 'Resave',
                });
                
                this.props.handlers.snackbarOpen('Save error (' + err.toString() + ')');
            }.bind(this)
        });
    },
    
    handleTypeChange: function(event, value) {
        var stateData = {
            combinedType: value,
        }
        
        var splitValue = value.split('_');
        
        stateData.type = splitValue[0];
        
        if(typeof(splitValue[1]) !== "undefined") {
            stateData.valueType = splitValue[1];
        }
        else {
            stateData.valueType = null;
        }
    
        this.setState(stateData);
    },

    render: function() {
        if(this.props.ruleBeingEdited !== null) {
            var rule = this.props.rules[this.props.ruleBeingEdited];
            var title = 'Edit Rule'
        }
        else {
            var rule = {};
            var title = 'Add Rule'
        }
        
        var allOptionsArray = [
            {value: 'all', label: 'All Categories (the rule will apply to all the categories for this field)'}
        ];
        
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
                    id="rule_form"
                    method="POST"
                    onValid={this.enableSubmitButton}
                    onInvalid={this.disableSubmitButton}
                    onValidSubmit={this.handleSubmit}
                    noValidate={true}
                    ref="rule"
                >
                    <Hidden name="id" value={rule.id} />
                    <Hidden name="type" value={this.state.type} />
                    <Hidden name="value_type" value={this.state.valueType} />
                    <Hidden name="choosing_instance_id" value={this.props.instance.id} />
                    <Text 
                        field={{
                            label: "Name*",
                            instructions: "Enter name",
                            name: "name",
                            section: false,
                            required: true,
                            defaultValue: rule.name,
                        }}
                    />
                    <Text field={{
                        fullWidth: true,
                        label: "Instructions",
                        instructions: "Provide instructions for the students on fulfilling this rule.",
                        name: "instructions",
                        section: false,
                        defaultValue: rule.instructions,
                    }} />
                    <Text field={{
                        fullWidth: true,
                        label: "Warning Message",
                        instructions: "This message will be shown to students if they fail to fulfil this rule.",
                        name: "warning",
                        section: true,
                        defaultValue: rule.warning,
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
                                    onChange: this.handleTypeChange,
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
                                    value:  this.state.combinedType,
                                }} 
                            />
                            {(this.state.valueType === "range")?
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
                                (this.state.valueType === "values")?
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
                                    onChange: this.handleScopeChange,
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
                                    value:  this.state.scope,
                                }} 
                            />
                            {(this.state.scope === "category")?
                                <div>
                                    <Dropdown 
                                        field={{
                                            label: "Category Field",
                                            name: "category_field",
                                            onChange: this.handleCategoryFieldChange,
                                            options: this.props.ruleCategoryFields,
                                            section: true, 
                                            value:  this.state.categoryFieldIndex,
                                        }} 
                                    />
                                    {(this.state.categoryFieldIndex !== null)?
                                        /*
                                        //TODO - Maybe use checkboxes and if multiple are selected, split it into separate rules when saving
                                        <Checkbox 
                                            field={{
                                                instructions: "Select the categories that you would like this rule to apply to.",
                                                label: "Categories",
                                                name: "categories",
                                                options: this.props.ruleCategoryFields[this.state.categoryFieldIndex].extra_field_options,
                                                section: true, 
                                                value:  this.props.ruleCategoryFieldOptionIndexes,
                                            }} 
                                            onChange={this.handleCategoryFieldOptionChange}
                                        />*/
                                        <Radio 
                                            field={{
                                                instructions: "Select the category that you would like this rule to apply to. If you want it to apply to more than one category, but not all of them, you will need to create separate rules for each one.",
                                                label: "Categories",
                                                name: "category",
                                                options: allOptionsArray.concat(this.props.ruleCategoryFields[this.state.categoryFieldIndex].extra_field_options),
                                                section: true, 
                                                value:  this.state.categoryFieldOptionValue,
                                            }} 
                                            onChange={this.handleCategoryFieldOptionChange}
                                        />
                                    :""}
                                    
                                </div>
                            :""}
                            {/*<p>This rule will be applied across all of the options.</p>*/}
                        </div>
                    </div>
                </Formsy.Form>
                {this.props.snackbar}
            </Container>
        );
    }
});

module.exports = RuleEditor;