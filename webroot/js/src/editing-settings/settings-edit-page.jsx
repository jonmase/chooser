import React from 'react';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import DateTime from '../elements/fields/datetime.jsx';
import FieldLabel from '../elements/fields/label.jsx';
import Hidden from '../elements/fields/hidden.jsx';
import Wysiwyg from '../elements/fields/wysiwyg.jsx';

var SettingsEditor = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            //instructions: this.props.instance.instructions,
            instructionsEditor: null,
            approval_required: this.props.instance.approval_required,
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
        var editor = this.state.instructionsEditor;
        if(typeof(editor) !== "undefined") {
            settings.instructions = editor.getData();
        }
        
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

    //When initialising instructions WYSIWYG, add editor to state
    handleInstructionsWysiwygInitialise: function(fieldName, editor) {
        var stateKey = fieldName + 'Editor';
        if(this.state[stateKey] === null) {
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
            title="Edit Editing Settings"
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
                            subtitle="Set the instructions for editing options"
                            title="Instructions"
                            //subtitle="Set the instructions for editing options, and other settings"
                            //title="Instructions & Other Settings"
                        >
                        </CardHeader>
                        <CardText 
                            expandable={true}
                        >
                            <Wysiwyg field={{
                                label: "Instructions for Editing",
                                instructions: "Provide instructions that will be shown on the option editing page.",
                                name: "instructions",
                                onInitialise: this.handleInstructionsWysiwygInitialise,
                                section: true,
                                value: this.state.instructions,
                            }} />
                            {/*
                            <div className="section" id="student_defined">
                                <FormsyToggle
                                    defaultToggled={(typeof(instance.student_defined) !== "undefined")?instance.student_defined:false}
                                    label="Allow student-defined options? If switched on, students will be able to create their own options (that will not bee seen by other students), using the fields specified when creating the Options Form"
                                    labelPosition="right"
                                    name="student_defined"
                                />
                            </div>
                            */}
                        </CardText>
                    </Card>

                    <Card 
                        className="page-card"
                        initiallyExpanded={true}
                    >
                        <CardHeader
                            actAsExpander={true}
                            showExpandableButton={true}
                            subtitle="Set up the process and dates for creating, and optionally approving, options"
                            title="Process & Dates"
                        >
                        </CardHeader>
                        <CardText 
                            expandable={true}
                        >
                            <p style={{marginTop: '0px'}}>All of the dates are optional. If unset, no restriction will be imposed. Date restrictions do not apply to Administrators.</p>
                            <DateTime field={{
                                    label: "Editing Opens (optional)",
                                    instructions: "Set the date/time when editing will open for Editors to start creating/editing options.",
                                    name: "opens",
                                    section: true,
                                    value: instance.opens || null,
                                }} 
                                time={true}
                            />
                            <DateTime field={{
                                    label: "Editing Deadline (optional)",
                                    instructions: "Set the date/time by which editing must be completed. This is a hard deadline, so Editors will not be able to create options after this point.",
                                    name: "deadline",
                                    section: true,
                                    value:  instance.deadline || null,
                                }} 
                                time={true}
                            />
                            <div id="approval">
                                <div className="section">
                                    <FormsyToggle
                                        //defaultToggled={this.state.approval_required}
                                        label="Do options need to be approved before they are shown to viewers?"
                                        labelPosition="right"
                                        name="approval_required"
                                        onChange={this.handleToggleChange}
                                        value={this.state.approval_required}
                                    />
                                </div>
                                <div className={this.state.approval_required?"":"hidden"}>
                                    <DateTime field={{
                                            label: "Approval Deadline (optional)",
                                            instructions: "Set the date/time by which approval should be completed. This is a soft/advisory deadline, Approvers will still be able to approve options after this point.",
                                            name: "approval_deadline",
                                            section: false,
                                            value:  instance.approval_deadline || null,
                                        }} 
                                        time={true}
                                    />
                                </div>
                            </div>
                        </CardText>
                    </Card>

                </Formsy.Form>
                
                {this.props.snackbar}
            </Container>
        );
    }
});

module.exports = SettingsEditor;