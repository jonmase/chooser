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
                <div style={{float: 'right'}}>
                    <ResetButton
                        handleClick={this.handleResetButtonClick}
                        tooltip="Reset Choice"
                    />
                    <EditButton
                        handleClick={this.props.handlers.editButtonClick}
                        id={null}
                        tooltip={editTooltip}
                    />
                </div>
                <CardHeader
                    actAsExpander={false}
                    showExpandableButton={false}
                    style={{marginRight: '96px'}}
                    textStyle={{paddingRight: 0}}
                    title="Settings"
                    subtitle="When the choice opens and closes, instructions, and other options"
                />
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
                                    handleClick={this.props.handlers.editButtonClick} 
                                    id={null} 
                                    label={editTooltip}
                                />
                            </div>
                        :
                            <div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-6">
                                        <Toggle
                                            explanation={"Choosing is " + (instance.choosable?"":"not ") + "enabled, so students can " + (instance.choosable?"make choices from":"just view and browse") + " the published options."}
                                            label="Choosing Enabled"
                                            paragraph={true}
                                            value={instance.choosable}
                                        />
                                        <DateTime label="Opens" paragraph={true} value={instance.opens} />
                                        {instance.choosable &&
                                            <div>
                                                <DateTime label="Deadline" paragraph={true} value={instance.deadline} />
                                                <DateTime label="Extension" paragraph={true} value={instance.extension} />
                                                <Toggle
                                                    explanation={"Students can" + (instance.editable?" edit choices up until the deadline":"not edit choices after submission")}
                                                    label="Editable"
                                                    paragraph={true}
                                                    value={instance.editable}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                                <Wysiwyg label={"Instructions " + (instance.choosable?"for Choosing":"when Viewing")} paragraph={true} value={instance.choosing_instructions || noInstructionsMessage} />
                                {instance.choosable &&
                                    <Wysiwyg label="Instructions for Reviewing" paragraph={true} value={instance.review_instructions || noInstructionsMessage} />
                                }
                                {instance.choosable &&
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-6">
                                            <Toggle 
                                                explanation={"Students can" + (instance.preference?((instance.preference_type === 'rank')?" rank":((instance.preference_type === 'points')?" assign points to":"")):"not express preferences for") + " options"}
                                                label="Preferences"
                                                paragraph={true}
                                                value={instance.preference}
                                            />
                                            {instance.preference?
                                                <div>
                                                    {(instance.preference_type === 'points')?
                                                        <Text label="Points Available" paragraph={true} value={instance.preference_points} />
                                                    :""}
                                                    {/*<Wysiwyg label="Instructions" value={instance.preference_instructions} />*/}
                                                </div>
                                            :""}
                                            <Toggle
                                                explanation={"Students can" + (instance.comments_per_option?"":"not") + " make separate comments about each option they have chosen"}
                                                label="Comments Per Option"
                                                paragraph={true}
                                                value={instance.comments_per_option}
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
                                                explanation={"Students can" + (instance.comments_overall?"":"not") + " make comments about their choice as a whole"}
                                                label="Overall Comments" 
                                                paragraph={true}
                                                value={instance.comments_overall}
                                            />
                                            {instance.comments_overall?
                                                <div>
                                                    {/*instance.comments_overall_limit?
                                                        <Text label="Character Limit" value={instance.comments_overall_limit} />
                                                    :""*/}
                                                    <Wysiwyg label="Instructions for Overall Comments" value={instance.comments_overall_instructions || noInstructionsMessage} />
                                                </div>
                                            :""}
                                        </div>
                                    </div>
                                }
                            </div>
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = Settings;