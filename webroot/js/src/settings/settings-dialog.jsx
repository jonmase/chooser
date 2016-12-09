import React from 'react';

import FlatButton from 'material-ui/FlatButton';

import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FormsyDialog from '../elements/formsy-dialog.jsx';
import FieldLabel from '../elements/fields/label.jsx';
import Text from '../elements/fields/text.jsx';
import Multiline from '../elements/fields/multiline-text.jsx';
import Wysiwyg from '../elements/fields/wysiwyg.jsx';
import DateTime from '../elements/fields/datetime.jsx';
import Dropdown from '../elements/fields/dropdown.jsx';
import Hidden from '../elements/fields/hidden.jsx';


var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var SettingsDialog = React.createClass({
    getInitialState: function () {
        var instance = this.props.containerState.instance;
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
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.dialogClose}
            />,
            <FlatButton
                key="submit"
                label={this.props.containerState.settingsSaveButtonLabel}
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit || !this.props.containerState.settingsSaveButtonEnabled}
            />,
        ];
        
        var instance = this.props.containerState.instance;
        
        return (
            <FormsyDialog
                actions={actions}
                contentStyle={customDialogStyle}
                dialogOnRequestClose={this.props.handlers.dialogClose}
                dialogOpen={this.props.containerState.settingsDialogOpen}
                dialogTitle="Edit Settings"
                formId="option_form"
                formOnValid={this.enableSubmitButton}
                formOnInvalid={this.disableSubmitButton}
                formOnValidSubmit={this.props.handlers.submit}
            >
                {instance.id?
                    <Hidden name="instance_id" value={instance.id} />
                    :
                    <p>You have not set this Choice up yet for students to choose their options. Complete the fields below to set up the Choice.</p>
                }
                <div id="instructions" style={{paddingTop: '24px'}}>
                    <Wysiwyg field={{
                        label: "Instructions for Choosing",
                        instructions: "Provide instructions for the students on making their choices. Note that rules will have separate instructions, so you do not need to give instructions on how to fulfil the rules here.",
                        name: "choosing_instructions",
                        onChange: this.props.handlers.handleWysiwygChange,
                        section: true,
                        value: this.props.containerState.settingsWysiwyg_choosing_instructions,
                    }} />
                </div>
                <div id="dates">
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
                </div>
                <div className="section" id="editable">
                    <FormsyToggle
                        defaultToggled={(typeof(instance.editable) !== "undefined")?instance.editable:true}
                        label="Allow students to edit choices. If switched on, students who have submitted choices, can return and edit them until the deadline"
                        labelPosition="right"
                        name="editable"
                    />
                </div>
                <div id="review_instructions">
                    <Multiline field={{
                        label: "Instructions for Reviewing",
                        instructions: "Provide instructions that the students will see when reviewing their options.",
                        name: "review_instructions",
                        //onChange: this.props.handlers.handleWysiwygChange,
                        section: true,
                        value: instance.review_instructions || null, //this.props.containerState.settingsWysiwyg_preference_instructions,
                    }} />
                </div>
                <div id="preferences">
                    <div className={this.props.containerState.settingsToggle_preference?"":"section"}>
                        <FormsyToggle
                            //defaultToggled={(typeof(instance.preference) !== "undefined")?instance.preference:false}
                            defaultToggled={this.props.containerState.settingsToggle_preference}
                            label="Allow students to express preferences for chosen options, e.g. by ranking or assigning points?"
                            labelPosition="right"
                            name="preference"
                            onChange={this.props.handlers.handleToggleChange}
                            //toggled={false}
                        />
                    </div>
                    <div className={this.props.containerState.settingsToggle_preference?"":"hidden"}>
                        <Dropdown field={{
                                label: "Preference Type",
                                name: "preference_type",
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
                            onChange={this.handlePreferenceTypeChange}
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
                            value: instance.preference_instructions || null, //this.props.containerState.settingsWysiwyg_preference_instructions,
                        }} />*/}
                    </div>
                </div>
                <div id="comments_options">
                    <div className="section">
                        <FormsyToggle
                            defaultToggled={this.props.containerState.settingsToggle_comments_per_option}
                            label="Allow students to make separate comments about each option they have chosen"
                            labelPosition="right"
                            name="comments_per_option"
                            onChange={this.props.handlers.handleToggleChange}
                        />
                    </div>
                    {/*<div className={this.props.containerState.settingsToggle_comments_per_option?"":"hidden"}>
                        <Multiline field={{
                            label: "Option Comments Instructions",
                            instructions: "Instructions for adding comments about each option",
                            name: "comments_per_option_instructions",
                            //onChange: this.props.handlers.handleWysiwygChange,
                            section: false,
                            value: instance.comments_per_option_instructions || null, //this.props.containerState.settingsWysiwyg_comments_per_option_instructions,
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
                <div id="comments_overall">
                    <div className="section">
                        <FormsyToggle
                            defaultToggled={this.props.containerState.settingsToggle_comments_overall}
                            label="Allow students to make comments about their choice as a whole"
                            labelPosition="right"
                            name="comments_overall"
                            onChange={this.props.handlers.handleToggleChange}
                        />
                    </div>
                    <div className={this.props.containerState.settingsToggle_comments_overall?"":"hidden"}>
                        <Multiline field={{
                            label: "Overall Comments Instructions",
                            instructions: "Instructions for adding comments about their choice as a whole",
                            name: "comments_overall_instructions",
                            onChange: this.props.handlers.handleWysiwygChange,
                            section: false,
                            value: instance.comments_overall_instructions || null, //this.props.containerState.settingsWysiwyg_comments_overall_instructions,
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
            </FormsyDialog>
        );
    }
});

module.exports = SettingsDialog