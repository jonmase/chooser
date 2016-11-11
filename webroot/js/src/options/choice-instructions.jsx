import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';

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
        var instance = this.props.instance.instance;
        
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
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
                            <div>
                                {(!instance.opens.passed)&&
                                    <div>
                                        This Choice will open at <strong><DateTime value={instance.opens} /></strong>.&nbsp; 
                                        {(this.props.role === 'admin')?
                                            <span>
                                                As an Administrator, you can view the available options and test the choosing process, but students are not able to see them yet. 
                                            </span>
                                        :
                                            (this.props.role === 'extra')&&
                                                <span>
                                                    You can view the available options below, but students are not able to see them yet. 
                                                </span>
                                        }
                                    </div>
                                }
                            </div>
                            <div>
                                {(instance.opens.passed && instance.deadline.passed && !instance.extension.passed)&&
                                    <div>
                                        The deadline has now passed
                                    </div>
                                }
                            </div>
                            <div>
                                {(instance.opens.passed || this.props.role === 'admin' || this.props.role === 'extra')&&
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Wysiwyg value={instance.choosing_instructions} />
                                                {(instance.deadline)&&
                                                    <div>
                                                        <DateTimeLabelled label="Deadline" value={instance.deadline} />
                                                        {(instance.extension)&&
                                                            <DateTimeLabelled label="Extension" value={instance.extension} />
                                                        }
                                                    </div>
                                                }
                                        </div>
                                        <div className="col-md-6">
                                            <Rules rules={this.props.rules} />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    :
                        <div>
                            This Choice is in 'read-only' mode, as it has not yet been fully configured. You can browse the available options below. Students will not be able to see the options yet.
                            {/*(this.props.role === 'admin')&&
                                //TODO: Button for admins to go to settings page
                            */}
                        </div>
                    }
                </CardText>
                                    {/*
                            <div className="row">
                                <div className="col-md-6">
                                    <Wysiwyg value={instance.choosing_instructions} />
                                        {(instance.opens.passed && instance.deadline)&&
                                            <div>
                                                <DateTimeLabelled label="Deadline" value={instance.deadline} />
                                                {(instance.extension)&&
                                                    <DateTimeLabelled label="Extension" value={instance.extension} />
                                                }
                                            </div>
                                        }
                                </div>
                                <div className="col-md-6">
                                    <Rules rules={this.props.rules} />
                                </div>
                            </div>
                        */}
            </Card>

        );
    }
});

module.exports = ChoiceInstructions;