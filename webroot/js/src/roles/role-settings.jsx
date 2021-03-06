import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import Formsy from 'formsy-react';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

var RolesSettingsForm = React.createClass({
    render: function() {
        var editorRole = this.props.roles[this.props.roleIndexesById['editor']];
        var reviewerRole = this.props.roles[this.props.roleIndexesById['reviewer']];

        return (
            <Card 
                className="page-card"
                initiallyExpanded={false}
            >
                <CardHeader
                    title="Default Permissions"
                    subtitle="Change the default permission settings for this Choice"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                >
                    <Formsy.Form
                        id="roles_settings_form"
                        method="POST"
                        onValidSubmit={this.props.handlers.submit}
                    >
                        <p className="no-top-margin">Please note that 'Instructors' means anyone who has the maintain or contribute role in a WebLearn site from which this Choice is linked.</p>
                        <div className="section">
                            <FormsyToggle
                                name="defaultRoles.editor"
                                //label={"Instructors are " + editorRole.title + "s, so they " + editorRole.description + " (in most situations, you would want this ticked)"}
                                label={"Instructors are " + editorRole.title + "s, so they " + editorRole.description}
                                defaultToggled={this.props.state.defaultRoles['editor']}
                                labelPosition="right"
                                onChange={this.props.handlers.change}
                            />
                        </div>
                        <div className="section">
                            <FormsyToggle
                                name="defaultRoles.reviewer"
                                //label={"Instructors are " + reviewerRole.title + "s, so they " + reviewerRole.description + " (normally they would only see who has selected their own options)"}
                                label={"Instructors are " + reviewerRole.title + "s, so they " + reviewerRole.description}
                                defaultToggled={this.props.state.defaultRoles['reviewer']}
                                labelPosition="right"
                                onChange={this.props.handlers.change}
                            />
                        </div>
                        {/*<div className="section">
                            <FormsyToggle
                                name="notify"
                                //label={<span><span>Notify users by email when they are given additional permissions</span><br /><span className="sublabel">This can be overridden when additional permissions are given</span></span>}
                                label="Notify users by email when they are given additional permissions (can be overridden)"
                                defaultToggled={this.props.state.notify}
                                labelPosition="right"
                                onChange={this.props.handlers.change}
                            />
                        </div>*/}
                        <RaisedButton 
                            label={this.props.state.settingsButton.label} 
                            primary={true} 
                            type="submit"
                            disabled={this.props.state.settingsButton.disabled}
                        />
                    </Formsy.Form>
                </CardText>
            </Card>
        );
    }
});

module.exports = RolesSettingsForm;