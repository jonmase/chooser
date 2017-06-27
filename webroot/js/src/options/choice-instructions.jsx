import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

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
    render: function() {
        var instance = this.props.choosingInstance;
        
        return (
            <Card 
                className="page-card"
                initiallyExpanded={this.props.expanded}
                onExpandChange={this.props.expandChangeHandler}
            >
                <CardHeader
                    title="Instructions & Rules"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                    style={styles.cardText}
                >
                    {(instance.id)?
                        <div>
                            {(!instance.opens.passed)?
                                <div>
                                    This Choice will open at <strong><DateTime value={instance.opens} /></strong>.&nbsp; 
                                    {(this.props.roles.indexOf('admin') > -1)?
                                        <span>
                                            As an Administrator, you can view the available options and test the choosing process, but students are not able to see them yet. 
                                        </span>
                                    :
                                        (this.props.roles.length > 0) &&
                                            <span>
                                                You can view the available options below, but students are not able to see them yet. 
                                            </span>
                                    }
                                </div>
                            :
                                <div>
                                    {(this.props.confirmedSelection.id)&&
                                        <div>
                                            {/*<div style={{float: 'right'}}>
                                                <RaisedButton
                                                    label="Abandon Changes"
                                                    onTouchTap={this.props.abandonHandler}
                                                    primary={false}
                                                    style={{marginRight: '15px'}}
                                                />
                                            </div>
                                            <p style={{marginRight: '200px'}}>*/}
                                            <p>
                                                You are changing the choices that you submitted on <DateTime value={this.props.confirmedSelection.modified} />. Any changes you make will not be saved unless you submit them in the next step. If you decide you don't want to make any changes, just use the Cancel Changes button.
                                            </p>
                                        </div>
                                    }
                                    {(instance.deadline.passed)?
                                        (instance.extension.passed)?
                                            <p>
                                                The deadline has now passed, and you can no longer {(this.props.confirmedSelection.id)?<span>change</span>:<span>make</span>} your choices. 
                                            </p>
                                        :
                                            <p>
                                                The deadline has passed, but you can still {(this.props.confirmedSelection.id)?<span>change</span>:<span>make</span>} your choices until <strong><DateTime value={instance.extension} /></strong>.
                                            </p>
                                    :""}
                                </div>
                            }
                            
                            {/*Show the instructions, deadline and rules*/}
                            {(instance.opens.passed || this.props.roles.length > 0)&&
                                <div className="row">
                                    <div className="col-xs-12 col-md-6">
                                        <div style={{marginRight: '20px'}}>
                                            <h5>Deadline</h5>
                                            {(instance.deadline)&&
                                                <div>
                                                    <DateTime value={instance.deadline} />
                                                    {/*<DateTimeLabelled label="Deadline" value={instance.deadline} />*/}
                                                    {/*(instance.extension)&&
                                                        <DateTimeLabelled label="Extension" value={instance.extension} />
                                                    */}
                                                </div>
                                            }
                                            <h5>Instructions</h5>
                                            <Wysiwyg value={instance.choosing_instructions} />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-md-6">
                                        <Rules rules={this.props.rules} />
                                    </div>
                                </div>
                            }
                        </div>
                    :
                        <div>
                            This Choice is in 'read-only' mode, as it has not yet been fully configured. You can browse the available options below. Students will not be able to see the options yet.
                            {/*(this.props.roles.indexOf('admin') > -1)&&
                                //TODO: Button for admins to go to settings page
                            */}
                        </div>
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = ChoiceInstructions;