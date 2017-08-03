import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import EditButtonRaised from '../elements/buttons/edit-button-raised.jsx';
import Wysiwyg from '../elements/display/wysiwyg.jsx';
import DateTimeLabelled from '../elements/display/datetime-labelled.jsx';
import DateTime from '../elements/display/datetime.jsx';
import Rules from './choice-instructions-rules.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var ChoiceInstructions = React.createClass({
    setUpEditingButtonClick: function() {
        window.location.href = "../editing-instances/view";
    },

    render: function() {
        var instance = this.props.editingInstance;
        
        return (
            <Card 
                className="page-card"
            >
                <CardHeader
                    title="Deadline & Instructions"
                    actAsExpander={false}
                    showExpandableButton={false}
                />
                <CardText 
                    expandable={false}
                    style={styles.cardText}
                >
                    {(instance.id)?
                        <div>
                            {(!instance.opens.passed)?
                                <p style={{marginTop: 0}}>
                                    Editing will open at <strong><DateTime value={instance.opens} /></strong>.&nbsp; 
                                    {(this.props.roles.indexOf('admin') > -1) &&
                                        <span>
                                            As an Administrator, you can create and edit options at any time. Editors will not be able to do so until editing opens. 
                                        </span>
                                    }
                                </p>
                            :
                                (instance.deadline.passed)?
                                    (this.props.roles.indexOf('admin') > -1) ?
                                        <p>The editing deadline has now passed, so Editors can no longer edit options.</p>
                                    :
                                        <p>
                                            The editing deadline has now passed, and you can no longer edit options. Please contact an administrator for this choice is you would like to make changes. 
                                        </p>
                                :
                                    <div style={{marginRight: '20px'}}>
                                        <h5>Deadline</h5>
                                        {(instance.deadline && instance.deadline.formatted)?
                                            <DateTime value={instance.deadline} />
                                        :
                                            <div>No deadline</div>
                                        }
                                        <h5>Instructions</h5>
                                        <Wysiwyg value={instance.instructions || "No instructions given"} />
                                    </div>
                            }
                            
                        </div>
                    :
                        (this.props.roles.indexOf('admin') > -1) ?
                            <div>
                                <p>
                                    Editing has not yet been set up for this Choice. As an Administrator, you can create and edit options, but Editors will not be able to do so until editing is set up. 
                                </p>
                                <EditButtonRaised 
                                    handleClick={this.setUpEditingButtonClick} 
                                    id={null} 
                                    label="Set up Editing"
                                />
                            </div>
                        :""
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = ChoiceInstructions;