import React from 'react';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import FieldLabel from '../elements/fields/label.jsx';
import Text from '../elements/fields/text.jsx';
import Multiline from '../elements/fields/multiline-text.jsx';
import Wysiwyg from '../elements/fields/wysiwyg.jsx';
import DateTime from '../elements/fields/datetime.jsx';
import Dropdown from '../elements/fields/dropdown.jsx';
import Hidden from '../elements/fields/hidden.jsx';

var SettingsEditor = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            choosable: (typeof(this.props.instance.choosable) === "undefined")?true:this.props.instance.choosable,  //true by default
            comments_overall: (typeof(this.props.instance.comments_overall) === "undefined")?false:this.props.instance.comments_overall,  //false by default
            //comments_per_option: this.props.instance.comments_per_option,
            preferenceType: 'rank',
            preference: (typeof(this.props.instance.preference) === "undefined")?false:this.props.instance.preference,  //false by default
            saveButtonEnabled: true,
            saveButtonLabel: 'Save',
        };
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false
        });
    },
    
    enableSubmitButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    handleSaveClick: function() {
        //Submit the form by ref
        this.refs.settings.submit();
    },
    
    handleSubmit: function(settings) {
        this.setState({
            saveButtonEnabled: false,
            saveButtonLabel: 'Saving',
        });

        //Get the wysiwyg editor data
        var wysiwygFields = ['choosing_instructions', 'review_instructions'];
        wysiwygFields.forEach(function (fieldName) {
            var editor = this.state[fieldName + 'Editor'];
            if(typeof(editor) !== "undefined") {
                settings[fieldName] = editor.getData();
            }
        }, this);
        
        
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
    
    handleToggleChange: function(event, value) {
        var stateData = {};
        stateData[event.target.name] = value;
        this.setState(stateData);
    },

    handlePreferenceTypeChange: function(event, value) {
        this.setState({
            preferenceType: value
        });
    },

    //When initialising instructions WYSIWYG, add editor to state
    handleWysiwygInitialise: function(fieldName, editor) {
        var stateKey = fieldName + 'Editor';
        if(typeof(this.state[stateKey]) === "undefined") {
            this.setState({[stateKey]: editor});
        }
    },
    
    render: function() {
        var instance = this.props.instance;
        
        var topbar = <TopBar 
            iconLeft={<TopBarBackButton onTouchTap={this.props.handlers.backButtonClick} />}
            iconRight={<RaisedButton 
                disabled={!this.state.canSubmit && this.state.saveButtonEnabled}
                label={this.state.saveButtonLabel}
                onTouchTap={this.handleSaveClick}
                style={{marginTop: '6px'}}
            />}
            title="Edit Choosing Settings"
        />;
        
        return (
            <Container topbar={topbar}>
                <Formsy.Form
                    id="settings_form"
                    method="POST"
                    onValid={this.enableSubmitButton}
                    onInvalid={this.disableSubmitButton}
                    onValidSubmit={this.handleSubmit}
                    noValidate={true}
                    ref="settings"
                >
                    {instance.id && 
                        <Hidden name="instance_id" value={instance.id} />
                    }
                    <Card 
                        className="page-card"
                        initiallyExpanded={true}
                    >
                        <CardHeader
                            actAsExpander={true}
                            showExpandableButton={true}
                            subtitle="Set whether choosing is enabled and the dates and times when the Choice will open and close"
                            title="Choosing, Dates & Times"
                        >
                        </CardHeader>
                        <CardText 
                            expandable={true}
                        >
                            <div className="section">
                                <FormsyToggle
                                    label="Enable choosing. Switch this off if you only want students to browse the options, but not actually make choices."
                                    labelPosition="right"
                                    name="choosable"
                                    onChange={this.handleToggleChange}
                                    value={this.state.choosable}
                                />
                            </div>
                            <DateTime field={{
                                    label: "Opens",
                                    instructions: "Set the date/time when the choice will become available",
                                    name: "opens",
                                    section: true,
                                    value: instance.opens || null,  //Should be defaultValue, but datetime.jsx uses value for defaultValue
                                }} 
                                time={true}
                            />
                            {this.state.choosable && 
                                <div>
                                    <DateTime field={{
                                            label: "Deadline",
                                            instructions: "Set the date/time when choices must be submitted",
                                            name: "deadline",
                                            section: true,
                                            value:  instance.deadline || null,  //Should be defaultValue, but datetime.jsx uses value for defaultValue
                                        }} 
                                        time={true}
                                    />
                                    <DateTime field={{
                                            label: "Extension",
                                            instructions: "Set an extension date/time. Up until this time it will still be possible to make choices, but they will be marked as late",
                                            name: "extension",
                                            section: true, 
                                            value:  instance.extension || null,  //Should be defaultValue, but datetime.jsx uses value for defaultValue
                                        }} 
                                        time={true}
                                    />
                                </div>
                            }
                        </CardText>
                    </Card>

                    <Card 
                        className="page-card"
                        initiallyExpanded={true}
                    >
                        <CardHeader
                            actAsExpander={true}
                            showExpandableButton={true}
                            subtitle="Set the instructions for choosing and reviewing options"
                            title="Instructions"
                        >
                        </CardHeader>
                        <CardText 
                            expandable={true}
                        >
                            <Wysiwyg field={{
                                label: "Instructions " + (this.state.choosable?"for Choosing":"when Viewing"),
                                instructions: "Provide instructions that will be shown on the " + (this.state.choosable?"choosing page. Note that rules will have separate instructions, so you do not need to give instructions on how to fulfil the rules here.":"option viewing page"),
                                name: "choosing_instructions",
                                onInitialise: this.handleWysiwygInitialise,
                                section: true,
                                value: instance.choosing_instructions,
                            }} />
                            {this.state.choosable && 
                                <Wysiwyg field={{
                                    label: "Instructions for Reviewing",
                                    instructions: "Provide instructions that will be shown on the review page.",
                                    name: "review_instructions",
                                    onInitialise: this.handleWysiwygInitialise,
                                    section: true,
                                    value: instance.review_instructions,
                                }} />
                            }
                            {/*<Multiline field={{
                                defaultValue: instance.review_instructions || null,
                                label: "Instructions for Reviewing",
                                instructions: "Provide instructions that the students will see when reviewing their options.",
                                name: "review_instructions",
                                section: true,
                            }} />*/}
                        </CardText>
                    </Card>
                    
                    {this.state.choosable && 
                        <Card 
                            className="page-card"
                            initiallyExpanded={true}
                        >
                            <CardHeader
                                actAsExpander={true}
                                showExpandableButton={true}
                                subtitle="Set options for editing choices, expressing preferences and adding comments"
                                title="Other Options"
                            >
                            </CardHeader>
                            <CardText 
                                expandable={true}
                            >
                                <div className="section" id="editable">
                                    <FormsyToggle
                                        defaultToggled={(typeof(instance.editable) !== "undefined")?instance.editable:true}
                                        label="Allow choices to be edited. If switched on, choosers can return and edit submitted choices until the deadline"
                                        labelPosition="right"
                                        name="editable"
                                    />
                                </div>
                                <div id="preferences">
                                    <div className={this.state.preference?"":"section"}>
                                        <FormsyToggle
                                            label="Allow choosers to express preferences for chosen options, e.g. by ranking or assigning points?"
                                            labelPosition="right"
                                            name="preference"
                                            onChange={this.handleToggleChange}
                                            value={this.state.preference}
                                        />
                                    </div>
                                    <div className={this.state.preference?"":"hidden"}>
                                        <Dropdown field={{
                                                label: "Preference Type",
                                                name: "preference_type",
                                                onChange: this.handlePreferenceTypeChange,
                                                options: [
                                                    {
                                                        label: "Ranking",
                                                        value: "rank",
                                                    },
                                                    {   
                                                        label: "Points",
                                                        value: "points",
                                                    }
                                                ],
                                                section: (this.state.preferenceType === "points")?false:true, 
                                                value:  this.state.preferenceType,
                                            }} 
                                        />
                                        <div className={(this.state.preferenceType === "points")?"":"hidden"}>
                                            <Text field={{
                                                defaultValue: instance.preference_points || null,
                                                label: "Points Available",
                                                instructions: "Points",
                                                name: "preference_points",
                                                section: true,
                                            }} />
                                        </div>
                                        {/*<Multiline field={{
                                            defaultValue: instance.preference_instructions || null,
                                            label: "Preference Instructions",
                                            instructions: "Provide instructions for expressing preferences.",
                                            name: "preference_instructions",
                                            section: true,
                                        }} />*/}
                                    </div>
                                </div>
                                <div id="comments_overall">
                                    <div className={this.state.comments_overall?"":"section"}>
                                        <FormsyToggle
                                            label="Allow comments about the choice as a whole"
                                            labelPosition="right"
                                            name="comments_overall"
                                            onChange={this.handleToggleChange}
                                            value={this.state.comments_overall}
                                        />
                                    </div>
                                    <div className={this.state.comments_overall?"section":"hidden"}>
                                        <Multiline field={{
                                            defaultValue: instance.comments_overall_instructions || null,
                                            label: "Overall Comments Instructions",
                                            instructions: "Instructions for adding comments about the choice as a whole",
                                            name: "comments_overall_instructions",
                                            section: false,
                                        }} />
                                        {/*<div>
                                            <Text field={{
                                                defaultValue: instance.comments_overall_limit || null,
                                                label: "Character Limit",
                                                instructions: "Limit",
                                                name: "comments_overall_limit",
                                                section: true,
                                            }} />
                                        </div>*/}
                                    </div>
                                </div>
                                <div id="comments_options">
                                    <div className="section">
                                        <FormsyToggle
                                            defaultToggled={this.props.comments_per_option}
                                            label="Allow comments about each chosen option"
                                            labelPosition="right"
                                            name="comments_per_option"
                                            //onChange={this.handleToggleChange}
                                            //value={this.state.comments_per_option}
                                        />
                                    </div>
                                    {/*<div className={this.state.comments_per_option?"":"hidden"}>
                                        <Multiline field={{
                                            defaultValue: instance.comments_per_option_instructions || null,
                                            label: "Option Comments Instructions",
                                            instructions: "Instructions for adding comments about each chosen option",
                                            name: "comments_per_option_instructions",
                                            section: false,
                                        }} />
                                        <div>
                                            <Text field={{
                                                defaultValue: instance.comments_per_option_limit || null,
                                                label: "Character Limit",
                                                instructions: "Limit",
                                                name: "comments_per_option_limit",
                                                section: true,
                                            }} />
                                        </div>
                                    </div>*/}
                                </div>
                            </CardText>
                        </Card>
                    }
                </Formsy.Form>
                
                {this.props.snackbar}
            </Container>
        );
    }
});

module.exports = SettingsEditor;