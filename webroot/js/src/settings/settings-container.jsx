import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

import Settings from './settings.jsx';
import Rules from './rules.jsx';
import SettingsEdit from './settings-edit-page.jsx';

var update = require('react-addons-update');

var ruleDefaults = {
    type: 'number',
    valueType: 'range',
    combinedType: 'number_range',
    scope: 'choice',
    categoryFieldIndex: null,
    categoryFieldOptionValue: null,
};

var SettingsContainer = React.createClass({
    loadInstanceFromServer: function() {
        var url = 'get-active/settings.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    instance: data.choosingInstance,
                    instanceLoaded: true
                });
                
                if(data.choosingInstance.id) {
                    this.setState({
                        rules: data.rules,
                        ruleCategoryFields: data.ruleCategoryFields,
                        ruleIndexesById: data.ruleIndexesById,
                        settingsToggle_preference: data.choosingInstance.preference,
                        settingsToggle_comments_overall: data.choosingInstance.comments_overall,
                        settingsToggle_comments_per_option: data.choosingInstance.comments_per_option,
                        settingsWysiwyg_choosing_instructions: data.choosingInstance.choosing_instructions,
                        settingsWysiwyg_review_instructions: data.choosingInstance.review_instructions,
                    });
                }
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {
            action: 'edit',
            instance: [],
            instanceLoaded: false,
            rules: [],
            ruleIndexesById: [],
            ruleCategoryFields: [],
            ruleEditDialogOpen: false,
            ruleBeingEdited: null,
            ruleSaveButtonEnabled: true,
            ruleSaveButtonLabel: 'Save',
            ruleType: ruleDefaults.type,
            ruleValueType: ruleDefaults.valueType,
            ruleCombinedType: ruleDefaults.combinedType,
            ruleScope: ruleDefaults.scope,
            ruleCategoryFieldIndex: ruleDefaults.categoryFieldIndex,
            ruleCategoryFieldOptionValue: ruleDefaults.categoryFieldOptionValue,
            ruleDeleteDialogOpen: false,
            ruleBeingDeleted: null,
            ruleDeleteButtonEnabled: true,
            ruleDeleteButtonLabel: 'Delete',
            settingsSaveButtonEnabled: true,
            settingsSaveButtonLabel: 'Save',
            settingsToggle_preference: false,
            settingsToggle_comments_overall: false,
            settingsToggle_comments_per_option: false,
            settingsWysiwyg_choosing_instructions: '',
            settingsWysiwyg_review_instructions: '',
            snackbar: {
                open: false,
                message: '',
            },
        };
    },
    componentDidMount: function() {
        this.loadInstanceFromServer();
        //this.loadRulesFromServer();
    },
    
    handleRuleDeleteDialogOpen: function(ruleIndex) {
        this.setState({
            ruleDeleteDialogOpen: true,
            ruleBeingDeleted: ruleIndex,
        });
    },

    handleRuleDeleteDialogClose: function() {
        this.setState({
            ruleDeleteDialogOpen: false,
            ruleBeingDeleted: null,
        });
    },
    
    handleRuleDelete: function(rule) {
        /*this.setState({
            ruleDeleteButtonEnabled: false,
            ruleDeleteButtonLabel: 'Deleting',
        });*/

        var rule = this.state.rules[this.state.ruleBeingDeleted];
        console.log("Deleting rule: ", rule);
        
        //Save the Rule
        var url = '../rules/delete/' + this.props.choice.id + '/' + this.state.instance.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: rule,
            success: function(returnedData) {
                console.log(returnedData.response);

                var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                stateData.ruleDeleteButtonEnabled = true;
                stateData.ruleDeleteButtonLabel = 'Delete';
                stateData.ruleDeleteDialogOpen = false;   //Close the Dialog
                stateData.ruleBeingDeleted = null;
                
                //Update the state instance
                stateData.rules = returnedData.rules;
                stateData.ruleIndexesById = returnedData.ruleIndexesById;
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    ruleSaveButtonEnabled: true,
                    ruleSaveButtonLabel: 'Retry',
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
            }.bind(this)
        });
    },

    handleRuleEditDialogOpen: function(ruleIndex) {
        var stateData = {
            ruleEditDialogOpen: true,
        }
        
        if(typeof(ruleIndex) !== "undefined") {
            //Editing a rule, so update the state with the values for this rule
            stateData.ruleBeingEdited = this.state.rules[ruleIndex].id;
            stateData.ruleType = this.state.rules[ruleIndex].type;
            stateData.ruleValueType = this.state.rules[ruleIndex].value_type;
            stateData.ruleCombinedType = this.state.rules[ruleIndex].combined_type;
            
            var scope = this.state.rules[ruleIndex].scope;
            if(scope === 'category_all') {
                stateData.ruleScope = 'category';
            }
            else {
                stateData.ruleScope = scope;
            }
            
            if(this.state.rules[ruleIndex].extra_field_id) {
                this.state.ruleCategoryFields.some(function(field, index) {
                    if(field.id === this.state.rules[ruleIndex].extra_field_id) {
                        stateData.ruleCategoryFieldIndex = index;
                        return true;
                    }
                }, this);
                
                if(scope === 'category_all') {
                    stateData.ruleCategoryFieldOptionValue = 'all';
                }
                else if(this.state.rules[ruleIndex].extra_field_option_id) {
                    this.state.ruleCategoryFields[stateData.ruleCategoryFieldIndex].extra_field_options.some(function(option, index) {
                        if(option.id === this.state.rules[ruleIndex].extra_field_option_id) {
                            stateData.ruleCategoryFieldOptionValue = option.value;
                            return true;
                        }
                    }, this);
                }
            }
        }
        else {
            //Adding a rule, so make sure the rule fields are set to the defaults
            stateData.ruleBeingEdited = null;
            stateData.ruleType = ruleDefaults.type;
            stateData.ruleValueType = ruleDefaults.valueType;
            stateData.ruleCombinedType = ruleDefaults.combinedType;
            stateData.ruleScope = ruleDefaults.scope;
            stateData.ruleCategoryFieldIndex = ruleDefaults.categoryFieldIndex;
            stateData.ruleCategoryFieldOptionValue = ruleDefaults.categoryFieldOptionValue;
        }
    
        this.setState(stateData);
    },

    handleRuleEditDialogClose: function() {
        this.setState({
            ruleEditDialogOpen: false,
            ruleBeingEdited: null,
        });
    },

    handleRuleCategoryFieldChange: function(event, value) {
        this.setState({
            ruleCategoryFieldIndex: value,
            ruleCategoryFieldOptionValue: null,
        });
    },

    handleRuleCategoryFieldOptionChange: function(event, value) {
        this.setState({
            ruleCategoryFieldOptionValue: value,
        });
    },

    handleRuleScopeChange: function(event, value) {
        this.setState({
            ruleScope: value,
            ruleCategoryFieldIndex: null,
            ruleCategoryFieldOptionValue: null,
        });
    },

    handleRuleTypeChange: function(event, value) {
        var stateData = {
            ruleCombinedType: value,
        }
        
        var splitValue = value.split('_');
        
        stateData.ruleType = splitValue[0];
        
        if(typeof(splitValue[1]) !== "undefined") {
            stateData.ruleValueType = splitValue[1];
        }
        else {
            stateData.ruleValueType = null;
        }
    
        this.setState(stateData);
    },

    handleRuleSubmit: function(rule) {
        this.setState({
            ruleSaveButtonEnabled: false,
            ruleSaveButtonLabel: 'Saving',
        });

        //Get the IDs of the category field and option
        if(rule.scope === 'category') {
            var extraField = this.state.ruleCategoryFields[rule.category_field];
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
        var url = '../rules/save/' + this.props.choice.id + '/' + this.state.instance.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: rule,
            success: function(returnedData) {
                console.log(returnedData.response);

                var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                stateData.ruleSaveButtonEnabled = true;
                stateData.ruleSaveButtonLabel = 'Save';
                stateData.ruleEditDialogOpen = false;   //Close the Dialog
                stateData.ruleBeingEdited = null;
                
                //Update the state instance
                stateData.rules = returnedData.rules;
                stateData.ruleIndexesById = returnedData.ruleIndexesById;
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    ruleSaveButtonEnabled: true,
                    ruleSaveButtonLabel: 'Resave',
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
            }.bind(this)
        });
    },

    handleSettingsDialogOpen: function(event) {
        this.setState({
            settingsDialogOpen: true,
        });
    },

    handleSettingsDialogClose: function() {
        this.setState({
            settingsDialogOpen: false,
        });
    },

    handleSettingsBackClick: function() {
        this.setState({
            action: 'view',
        });
    },

    handleSettingsEditClick: function() {
        this.setState({
            action: 'edit',
        });
    },
    
    handleSettingsSubmit: function(settings) {
        this.setState({
            settingsSaveButtonEnabled: false,
            settingsSaveButtonLabel: 'Saving',
        });

        //Get the wysiwyg editor data
        settings.choosing_instructions = this.state.settingsWysiwyg_choosing_instructions;
        settings.review_instructions = this.state.settingsWysiwyg_review_instructions;
        
        console.log("Saving settings: ", settings);
        
        //Save the settings
        var url = 'save';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: settings,
            success: function(returnedData) {
                console.log(returnedData.response);

                var stateData = {};
                
                //Show the response message in the snackbar
                stateData.snackbar = {
                    open: true,
                    message: returnedData.response,
                }
                stateData.settingsSaveButtonEnabled = true;
                stateData.settingsSaveButtonLabel = 'Save';
                stateData.settingsDialogOpen = false;   //Close the Dialog
                
                //Update the state instance
                stateData.instance = returnedData.instance;
                
                this.setState(stateData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    settingsSaveButtonEnabled: true,
                    settingsSaveButtonLabel: 'Resave',
                    snackbar: {
                        open: true,
                        message: 'Save error (' + err.toString() + ')',
                    }
                });
            }.bind(this)
        });
    },

    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    handleSettingsToggleChange: function(event, value) {
        var stateData = {};
        stateData['settingsToggle_' + event.target.name] = value;
        this.setState(stateData);
    },

    handleSettingsWysiwygChange: function(element, value) {
        var stateData = {};
        stateData['settingsWysiwyg_' + element] = value;
        this.setState(stateData);
    },
    
    render: function() {
        var settingsHandlers={
            backButtonClick: this.handleSettingsBackClick,
            editButtonClick: this.handleSettingsEditClick,
            handleToggleChange: this.handleSettingsToggleChange,
            submit: this.handleSettingsSubmit,
            handleWysiwygChange: this.handleSettingsWysiwygChange,
        };
        var rulesHandlers={
            categoryFieldChange: this.handleRuleCategoryFieldChange,
            categoryFieldOptionChange: this.handleRuleCategoryFieldOptionChange,
            deleteDialogOpen: this.handleRuleDeleteDialogOpen,
            deleteDialogClose: this.handleRuleDeleteDialogClose,
            delete: this.handleRuleDelete,
            editDialogOpen: this.handleRuleEditDialogOpen,
            editDialogClose: this.handleRuleEditDialogClose,
            editSubmit: this.handleRuleSubmit,
            scopeChange: this.handleRuleScopeChange,
            settingsDialogOpen: this.handleSettingsDialogOpen,
            typeChange: this.handleRuleTypeChange,
        };

        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={null}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name + ": Choice Settings"} />}
        />;
        
        var snackbar = <Snackbar
                        open={this.state.snackbar.open}
                        message={this.state.snackbar.message}
                        autoHideDuration={3000}
                        onRequestClose={this.handleSnackbarClose}
                    />;

        if(this.state.action === 'view') {
            return (
                <Container topbar={topbar} title={false}>
                    <Settings
                        choice={this.props.choice}
                        handlers={settingsHandlers}
                        containerState={this.state}
                    />
                    <Rules
                        choice={this.props.choice}
                        handlers={rulesHandlers}
                        containerState={this.state}
                    />
                    {snackbar}
                </Container>
            );
        }
        else if(this.state.action === 'edit') {
            return (
                <SettingsEdit
                    choice={this.props.choice}
                    dashboardUrl={this.props.dashboardUrl} 
                    handlers={settingsHandlers}
                    instance={this.state.instance}
                    sections={this.props.sections} 
                    settingsToggle_preference={this.state.settingsToggle_preference}
                    settingsToggle_comments_overall={this.state.settingsToggle_comments_overall}
                    settingsToggle_comments_per_option={this.state.settingsToggle_comments_per_option}
                    settingsWysiwyg_choosing_instructions={this.state.settingsWysiwyg_choosing_instructions}
                    settingsWysiwyg_review_instructions={this.state.settingsWysiwyg_review_instructions}
                    snackbar={snackbar}
                />
            );
        }
        /*else if(this.state.action === 'rule') {
            return (
                <SettingsEdit
                    choice={this.props.choice}
                    dashboardUrl={this.props.dashboardUrl} 
                    handlers={settingsHandlers}
                    instance={this.state.instance}
                    sections={this.props.sections} 
                    settingsToggle_preference={this.state.settingsToggle_preference}
                    settingsToggle_comments_overall={this.state.settingsToggle_comments_overall}
                    settingsToggle_comments_per_option={this.state.settingsToggle_comments_per_option}
                    settingsWysiwyg_choosing_instructions={this.state.settingsWysiwyg_choosing_instructions}
                    snackbar={snackbar}
                />
            );
        }*/
    }
});

module.exports = SettingsContainer;