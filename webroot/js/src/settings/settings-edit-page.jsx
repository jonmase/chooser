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

var SettingsPage = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            choosing_instructions: this.props.instance.choosing_instructions,
            comments_overall: this.props.instance.comments_overall,
            comments_per_option: this.props.instance.comments_per_option,
            preferenceType: 'rank',
            preference: this.props.instance.preference,
            review_instructions: this.props.instance.review_instructions,
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
        settings.choosing_instructions = this.state.choosing_instructions;
        settings.review_instructions = this.state.review_instructions;
        
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
                
                this.props.handlers.returnedData(returnedData);
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

    handleWysiwygChange: function(element, value) {
        var stateData = {};
        stateData[element] = value;
        this.setState(stateData);
    },

    handlePreferenceTypeChange: function(event, value) {
        this.setState({
            preferenceType: value
        });
    },

    render: function() {
        var instance = this.props.instance;
        
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft={<TopBarBackButton onTouchTap={this.props.handlers.backButtonClick} />}
            iconRight={<RaisedButton 
                disabled={!this.state.canSubmit && this.state.saveButtonEnabled}
                label={this.state.saveButtonLabel}
                onTouchTap={this.handleSaveClick}
                style={{marginTop: '6px'}}
            />}
            sections={this.props.sections} 
            title="Edit Choice Settings"
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
                            subtitle="Set the dates and times when the Choice will open and close"
                            title="Dates & Times"
                        >
                        </CardHeader>
                        <CardText 
                            expandable={true}
                        >
                            <DateTime field={{
                                    label: "Opens",
                                    instructions: "Set the date/time when the choice will become available",
                                    name: "opens",
                                    section: true,
                                    value: instance.opens || null,
                                }} 
                                time={true}
                            />
                            <DateTime field={{
                                    label: "Deadline",
                                    instructions: "Set the date/time when choices must be submitted",
                                    name: "deadline",
                                    section: true,
                                    value:  instance.deadline || null,
                                }} 
                                time={true}
                            />
                            <DateTime field={{
                                    label: "Extension",
                                    instructions: "Set an extension date/time. Up until this time it will still be possible to make choices, but they will be marked as late",
                                    name: "extension",
                                    section: true, 
                                    value:  instance.extension || null,
                                }} 
                                time={true}
                            />
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
                                label: "Instructions for Choosing",
                                instructions: "Provide instructions that will be shown on the choosing page. Note that rules will have separate instructions, so you do not need to give instructions on how to fulfil the rules here.",
                                name: "choosing_instructions",
                                onChange: this.handleWysiwygChange,
                                section: true,
                                value: this.state.choosing_instructions,
                            }} />
                            <Wysiwyg field={{
                                label: "Instructions for Reviewing",
                                instructions: "Provide instructions that will be shown on the review page.",
                                name: "review_instructions",
                                onChange: this.handleWysiwygChange,
                                section: true,
                                value: this.state.review_instructions,
                            }} />
                            {/*<Multiline field={{
                                label: "Instructions for Reviewing",
                                instructions: "Provide instructions that the students will see when reviewing their options.",
                                name: "review_instructions",
                                section: true,
                                value: instance.review_instructions || null,
                            }} />*/}
                        </CardText>
                    </Card>
                    
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
                                        //defaultToggled={(typeof(instance.preference) !== "undefined")?instance.preference:false}
                                        defaultToggled={this.state.preference}
                                        label="Allow choosers to express preferences for chosen options, e.g. by ranking or assigning points?"
                                        labelPosition="right"
                                        name="preference"
                                        onChange={this.handleToggleChange}
                                        //toggled={false}
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
                                            label: "Points Available",
                                            instructions: "Points",
                                            name: "preference_points",
                                            section: true,
                                            value: instance.preference_points || null,
                                        }} />
                                    </div>
                                    {/*<Multiline field={{
                                        label: "Preference Instructions",
                                        instructions: "Provide instructions for expressing preferences.",
                                        name: "preference_instructions",
                                        section: true,
                                        value: instance.preference_instructions || null,
                                    }} />*/}
                                </div>
                            </div>
                            <div id="comments_overall">
                                <div className={this.state.comments_overall?"":"section"}>
                                    <FormsyToggle
                                        defaultToggled={this.state.comments_overall}
                                        label="Allow comments about the choice as a whole"
                                        labelPosition="right"
                                        name="comments_overall"
                                        onChange={this.handleToggleChange}
                                    />
                                </div>
                                <div className={this.state.comments_overall?"section":"hidden"}>
                                    <Multiline field={{
                                        label: "Overall Comments Instructions",
                                        instructions: "Instructions for adding comments about the choice as a whole",
                                        name: "comments_overall_instructions",
                                        section: false,
                                        value: instance.comments_overall_instructions || null,
                                    }} />
                                    {/*<div>
                                        <Text field={{
                                            label: "Character Limit",
                                            instructions: "Limit",
                                            name: "comments_overall_limit",
                                            section: true,
                                            value: instance.comments_overall_limit || null,
                                        }} />
                                    </div>*/}
                                </div>
                            </div>
                            <div id="comments_options">
                                <div className="section">
                                    <FormsyToggle
                                        defaultToggled={this.state.comments_per_option}
                                        label="Allow comments about each chosen option"
                                        labelPosition="right"
                                        name="comments_per_option"
                                        onChange={this.handleToggleChange}
                                    />
                                </div>
                                {/*<div className={this.state.comments_per_option?"":"hidden"}>
                                    <Multiline field={{
                                        label: "Option Comments Instructions",
                                        instructions: "Instructions for adding comments about each chosen option",
                                        name: "comments_per_option_instructions",
                                        //onChange: this.handleWysiwygChange,
                                        section: false,
                                        value: instance.comments_per_option_instructions || null,
                                    }} />
                                    <div>
                                        <Text field={{
                                            label: "Character Limit",
                                            instructions: "Limit",
                                            name: "comments_per_option_limit",
                                            section: true,
                                            value: instance.comments_per_option_limit || null,
                                        }} />
                                    </div>
                                </div>*/}
                            </div>
                        </CardText>
                    </Card>
                </Formsy.Form>
                
                {this.props.snackbar}
            </Container>
        );
    }
});

module.exports = SettingsPage