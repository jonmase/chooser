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
        window.location.href = 'reset';
    },

    render: function() {
        var instance = this.props.instance;
    
        if(instance.id) {
            var editTooltip = "Edit Settings";
        }
        else {
            var editTooltip = "Set Up Editing";
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
                    subtitle="The editing process, when it opens and closes, instructions, and other options"
                    title="Settings"
                >
                    <div style={{float: 'right'}}>
                        <ResetButton
                            handleReset={this.handleResetButtonClick}
                            tooltip="Reset Editing"
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
                                <p style={{marginTop: 0}}>This Choice has not been set up yet.</p>
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
                                    </div>
                                </div>
                                <Wysiwyg label="Instructions" value={instance.instructions || noInstructionsMessage} />
                                <Toggle 
                                    label="Student Defined Options"
                                    value={instance.students_defined}
                                    explanation={""}
                                />
                                <Toggle
                                    label="Approval Required"
                                    value={instance.approval_required}
                                    explanation={""}
                                />
                            </div>
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = Settings;