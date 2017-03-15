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
            commentsOverallToggle: false,
            commentsPerOptionToggle: false,
            preferenceToggle: false,
            preferenceType: 'rank',
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
    
    handleCommentsOverallChange: function(event, value) {
        this.setState({
            commentsOverallToggle: value
        });
    },

    handleCommentsPerOptionChange: function(event, value) {
        this.setState({
            commentsPerOptionToggle: value
        });
    },

    handlePreferenceChange: function(event, value) {
        this.setState({
            preferenceToggle: value
        });
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
                disabled={!this.state.canSubmit}
                label="Save"
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
                    onValidSubmit={this.props.handlers.submit}
                    noValidate={true}
                    ref="settings"
                >
                    {instance.id?
                        <Hidden name="instance_id" value={instance.id} />
                        :
                        <p>You have not set this Choice up yet for students to choose their options. Complete the fields below to set up the Choice.</p>
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
                                    instructions: "Set the date/time when the choice will become available to students",
                                    name: "opens",
                                    section: true,
                                    value: instance.opens || null,
                                }} 
                                time={true}
                            />
                            <DateTime field={{
                                    label: "Deadline",
                                    instructions: "Set the date/time when the students must submit their choices",
                                    name: "deadline",
                                    section: true,
                                    value:  instance.deadline || null,
                                }} 
                                time={true}
                            />
                            <DateTime field={{
                                    label: "Extension",
                                    instructions: "Set an extension date/time, after which the students will still be able to make their choices, but they will be marked as late",
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
                            subtitle="Set the instructions that students will see when choosing options and reviewing their selection"
                            title="Instructions"
                        >
                        </CardHeader>
                        <CardText 
                            expandable={true}
                        >
                            <Wysiwyg field={{
                                label: "Instructions for Choosing",
                                instructions: "Provide instructions for the students on making their choices. Note that rules will have separate instructions, so you do not need to give instructions on how to fulfil the rules here.",
                                name: "choosing_instructions",
                                onChange: this.props.handlers.handleWysiwygChange,
                                section: true,
                                value: this.props.settingsWysiwyg_choosing_instructions,
                            }} />
                            <Wysiwyg field={{
                                label: "Instructions for Reviewing",
                                instructions: "Provide instructions that the students will see when reviewing their options.",
                                name: "review_instructions",
                                onChange: this.props.handlers.handleWysiwygChange,
                                section: true,
                                value: this.props.settingsWysiwyg_review_instructions,
                            }} />
                            {/*<Multiline field={{
                                label: "Instructions for Reviewing",
                                instructions: "Provide instructions that the students will see when reviewing their options.",
                                name: "review_instructions",
                                //onChange: this.props.handlers.handleWysiwygChange,
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
                                    label="Allow students to edit choices. If switched on, students who have submitted choices, can return and edit them until the deadline"
                                    labelPosition="right"
                                    name="editable"
                                />
                            </div>
                            <div id="preferences">
                                <div className={this.props.settingsToggle_preference?"":"section"}>
                                    <FormsyToggle
                                        //defaultToggled={(typeof(instance.preference) !== "undefined")?instance.preference:false}
                                        defaultToggled={this.props.settingsToggle_preference}
                                        label="Allow students to express preferences for chosen options, e.g. by ranking or assigning points?"
                                        labelPosition="right"
                                        name="preference"
                                        onChange={this.props.handlers.handleToggleChange}
                                        //toggled={false}
                                    />
                                </div>
                                <div className={this.props.settingsToggle_preference?"":"hidden"}>
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
                                        instructions: "Provide instructions for the students on expressing their preferences.",
                                        name: "preference_instructions",
                                        //onChange: this.props.handlers.handleWysiwygChange,
                                        section: true,
                                        value: instance.preference_instructions || null, //this.props.settingsWysiwyg_preference_instructions,
                                    }} />*/}
                                </div>
                            </div>
                            <div id="comments_overall">
                                <div className={this.props.settingsToggle_comments_overall?"":"section"}>
                                    <FormsyToggle
                                        defaultToggled={this.props.settingsToggle_comments_overall}
                                        label="Allow students to make comments about their choice as a whole"
                                        labelPosition="right"
                                        name="comments_overall"
                                        onChange={this.props.handlers.handleToggleChange}
                                    />
                                </div>
                                <div className={this.props.settingsToggle_comments_overall?"section":"hidden"}>
                                    <Multiline field={{
                                        label: "Overall Comments Instructions",
                                        instructions: "Instructions for adding comments about their choice as a whole",
                                        name: "comments_overall_instructions",
                                        onChange: this.props.handlers.handleWysiwygChange,
                                        section: false,
                                        value: instance.comments_overall_instructions || null, //this.props.settingsWysiwyg_comments_overall_instructions,
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
                            <div id="comments_options" style={{paddingBottom: '2rem'}}>
                                <div className="section">
                                    <FormsyToggle
                                        defaultToggled={this.props.settingsToggle_comments_per_option}
                                        label="Allow students to make separate comments about each option they have chosen"
                                        labelPosition="right"
                                        name="comments_per_option"
                                        onChange={this.props.handlers.handleToggleChange}
                                    />
                                </div>
                                {/*<div className={this.props.settingsToggle_comments_per_option?"":"hidden"}>
                                    <Multiline field={{
                                        label: "Option Comments Instructions",
                                        instructions: "Instructions for adding comments about each option",
                                        name: "comments_per_option_instructions",
                                        //onChange: this.props.handlers.handleWysiwygChange,
                                        section: false,
                                        value: instance.comments_per_option_instructions || null, //this.props.settingsWysiwyg_comments_per_option_instructions,
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