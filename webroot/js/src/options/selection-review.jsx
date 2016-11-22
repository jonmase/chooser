import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';

import OptionList from './option-list.jsx';

import Text from '../elements/display/text-labelled.jsx';
import DateTime from '../elements/display/datetime.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var SelectionReview = React.createClass({
    render: function() {
        return (
            <div>
                <Paper rounded={false} zDepth={1} style={{padding: '16px', margin: '15px 0'}}>
                    <p style={{marginTop: 0}}>
                        {(!this.props.selection.selection.confirmed)? 
                            (this.props.instance.instance.deadline.passed || this.props.instance.instance.extension.passed)?
                                <span>You did not submit your choices and the deadline has now passed.</span>
                            :
                                <span>You have not submitted any choices.</span>
                    :
                        <span>You submitted your choices at <DateTime value={this.props.selection.selection.modified} />.</span>
                    }
                    </p>
                    
                    <div>
                        {(this.props.instance.instance.editable && (!this.props.instance.instance.deadline.passed || !this.props.instance.instance.extension.passed))&&
                            <div>
                                <span>You can change your choices until the deadline at&nbsp;<strong>
                                    {(!this.props.instance.instance.deadline.passed)?
                                        <DateTime value={this.props.instance.instance.deadline} />
                                    :
                                        <DateTime value={this.props.instance.instance.extension} />
                                    }
                                </strong>.</span>
                                {this.props.instance.instance.deadline.passed}
                                {/*
                                <div style={{marginTop: '10px'}}>
                                    <RaisedButton
                                        label="Change"
                                        onTouchTap={this.props.optionContainerHandlers.backToEdit}
                                        primary={false}
                                    />
                                </div>
                                */}
                            </div>
                        }
                    </div>
                </Paper>
                
                {(this.props.selection.selection.confirmed) &&
                    <Card>
                        <CardHeader title="Your Choices" />
                        <CardText style={{paddingTop: 0}}>
                            <div>
                                {(this.props.optionsSelectedPreferenceOrder.length > 0)?
                                    <div style={{width: '100%'}}>
                                        <OptionList
                                            action="review"
                                            instance={this.props.instance.instance}
                                            optionIds={this.props.optionsSelectedPreferenceOrder}
                                            options={this.props.options}
                                            optionsSelected={this.props.optionsSelected}
                                            removeButton={false}
                                            style={{paddingTop: 0}}
                                            useCode={this.props.choice.use_code}
                                        />
                                    </div>
                                :
                                    <div>No options chosen</div>
                                }
                            </div>
                            <div>
                                {(this.props.instance.instance.comments_overall && this.props.selection.selection.comments)?
                                    <Text 
                                        value={this.props.selection.selection.comments}
                                        label="Comments"
                                    />
                                :""}
                            </div>
                        </CardText>
                    </Card>
                }
            </div>
        );
    }
});

module.exports = SelectionReview;