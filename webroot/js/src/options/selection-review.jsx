import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

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
            <Card 
                className="page-card"
                //initiallyExpanded={true}
            >
                <CardHeader
                    title="Review Chosen Options"
                    //actAsExpander={true}
                    //showExpandableButton={true}
                />
                <CardText 
                    //expandable={true}
                    style={styles.cardText}
                >
                    <div>
                        <div>
                            {(!this.props.selection.selection.confirmed)? 
                                (this.props.instance.instance.deadline.passed || this.props.instance.instance.extension.passed)?
                                    <p>You did not submit your choices and the deadline has now passed.</p>
                                :
                                    <p>You have not submitted any choices.</p>
                        :
                            <p>You submitted your choices at <DateTime value={this.props.selection.selection.modified} />.</p>
                        }
                        </div>
                        
                        <div>
                            {(this.props.instance.instance.editable && (!this.props.instance.instance.deadline.passed || !this.props.instance.instance.extension.passed))&&
                                <div>
                                    <span> You can change your choices until the deadline: <DateTime value={this.props.instance.instance.deadline} />.</span>
                                    <div style={{marginTop: '10px'}}>
                                        <RaisedButton
                                            label="Change"
                                            onTouchTap={this.props.optionContainerHandlers.backToEdit}
                                            primary={false}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                        
                        {(this.props.selection.selection.confirmed) &&
                            <div>
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
                            </div>
                        }
                    </div>
                    
                </CardText>
            </Card>
        );
    }
});

module.exports = SelectionReview;