import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';

import EditButton from '../elements/buttons/edit-button.jsx';
import EditButtonRaised from '../elements/buttons/edit-button-raised.jsx';
import ResetButton from '../elements/buttons/reset-button.jsx';

import Text from '../elements/display/text-labelled.jsx';
import Wysiwyg from '../elements/display/wysiwyg-labelled.jsx';
import DateTime from '../elements/display/datetime-labelled.jsx';
import Toggle from '../elements/display/toggle-labelled.jsx';

import Loader from '../elements/loader.jsx';

var Settings = React.createClass({
    handleResetButtonClick: function() {
        window.location.href = '../choices/reset';
    },

    render: function() {
        var instance = this.props.instance;
    
        if(instance.id) {
            var editTooltip = "Edit Settings";
        }
        else {
            var editTooltip = "Set Up Choosing";
        }
        
        var noInstructionsMessage = "No instructions given";
    
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    actAsExpander={false}
                    showExpandableButton={false}
                    subtitle="When the choice opens and closes, instructions, and other options"
                    title="Settings"
                >
                    <div style={{float: 'right'}}>
                        <ResetButton
                            handleReset={this.handleResetButtonClick}
                            tooltip="Reset Choice"
                        />
                        <EditButton
                            handleEdit={this.props.handlers.editButtonClick}
                            id={null}
                            tooltip={editTooltip}
                        />
                    </div>
                </CardHeader>
                <CardText 
                    expandable={false}
                >
                    {!this.props.instanceLoaded?
                        <Loader />
                    :
                        !instance.id?
                            <div>
                                <p style={{marginTop: 0}}>Choosing has not been set up yet.</p>
                                <EditButtonRaised 
                                    handleEdit={this.props.handlers.editButtonClick} 
                                    id={null} 
                                    label={editTooltip}
                                />
                            </div>
                        :
                            <div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6">
                                        <DateTime label="Opens" value={instance.opens} />
                                        <DateTime label="Deadline" value={instance.deadline} />
                                        <DateTime label="Extension" value={instance.extension} />
                                        <Toggle
                                            label="Editable"
                                            value={instance.editable}
                                            explanation={"Students can" + (instance.editable?" edit choices up until the deadline":"not edit choices after submission")}
                                        />
                                    </div>
                                </div>
                                <Wysiwyg label="Instructions for Choosing" value={instance.choosing_instructions || noInstructionsMessage} />
                                <Wysiwyg label="Instructions for Reviewing" value={instance.review_instructions || noInstructionsMessage} />
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6">
                                        <Toggle 
                                            label="Preferences"
                                            value={instance.preference}
                                            explanation={"Students can" + (instance.preference?((instance.preference_type === 'rank')?" rank":((instance.preference_type === 'points')?" assign points to":"")):"not express preferences for") + " options"}
                                        />
                                        {instance.preference?
                                            <div>
                                                {(instance.preference_type === 'points')?
                                                    <Text label="Points Available" value={instance.preference_points} />
                                                :""}
                                                {/*<Wysiwyg label="Instructions" value={instance.preference_instructions} />*/}
                                            </div>
                                        :""}
                                        <Toggle
                                            label="Comments Per Option"
                                            value={instance.comments_per_option}
                                            explanation={"Students can" + (instance.comments_per_option?"":"not") + " make separate comments about each option they have chosen"}
                                        />
                                        {/*instance.comments_per_option?
                                            <div>
                                                {instance.comments_per_option_limit?
                                                    <Text label="Character Limit" value={instance.comments_per_option_limit} />
                                                :""}
                                                <Wysiwyg label="Instructions" value={instance.comments_per_option_instructions} />
                                            </div>
                                        :""*/}
                                    </div>
                                    <div className="col-xs-12 col-sm-6">
                                        <Toggle 
                                            label="Overall Comments" 
                                            value={instance.comments_overall}
                                            explanation={"Students can" + (instance.comments_overall?"":"not") + " make comments about their choice as a whole"}
                                        />
                                        {instance.comments_overall?
                                            <div>
                                                {/*instance.comments_overall_limit?
                                                    <Text label="Character Limit" value={instance.comments_overall_limit} />
                                                :""*/}
                                                <Wysiwyg label="Instructions for Overall Comments" value={instance.comments_overall_instructions} />
                                            </div>
                                        :""}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6">
                                    </div>
                                </div>
                            </div>
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = Settings;