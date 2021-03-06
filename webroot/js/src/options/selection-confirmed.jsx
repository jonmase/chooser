import React from 'react';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import OptionList from './option-list.jsx';

import Text from '../elements/display/text-labelled.jsx';
import DateTime from '../elements/display/datetime.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var SelectionConfirmed = React.createClass({
    render: function() {
        var submissionMessage = '';
        var headerTitle = '';
        if(!this.props.selection.selection.confirmed) {
            headerTitle = 'Choices Not Submitted';
            if(this.props.choosingInstance.deadline.passed || this.props.choosingInstance.extension.passed) {
                submissionMessage = 'You did not submit your choices and the deadline has now passed.';
            }
            else {
                submissionMessage = 'You have not submitted any choices.';
            }
        }
        else {
            headerTitle = 'Choices Submitted';
            submissionMessage = <span>You submitted your choices at <DateTime value={this.props.selection.selection.modified} />.</span>;
        }
    
        return (
            <div>
                <Card className="page-card">
                    <CardHeader title={headerTitle} />
                    <CardText style={{paddingTop: 0}}>
                        <p style={{marginTop: 0}}>
                            {submissionMessage}
                        </p>
                        <div>
                            {(this.props.choosingInstance.editable && (!this.props.choosingInstance.deadline.passed || !this.props.choosingInstance.extension.passed))&&
                                <div>
                                    <span>You can change your choices until the deadline at&nbsp;<strong>
                                        {(!this.props.choosingInstance.deadline.passed)?
                                            <DateTime value={this.props.choosingInstance.deadline} />
                                        :
                                            <DateTime value={this.props.choosingInstance.extension} />
                                        }
                                    </strong>.</span>
                                </div>
                            }
                        </div>
                    </CardText>
                    {(this.props.choosingInstance.editable && (!this.props.choosingInstance.deadline.passed || !this.props.choosingInstance.extension.passed))&&
                        <CardActions>
                            <RaisedButton 
                                label="Change Choices" 
                                onTouchTap={this.props.optionContainerHandlers.change} 
                                primary={true} 
                            />
                        </CardActions>
                    } 
                </Card>
                
                {(this.props.selection.selection.confirmed) &&
                    <Card className="page-card">
                        <CardHeader title="Your Choices" />
                        <CardText style={{paddingTop: 0}}>
                            <div>
                                {(this.props.optionsSelectedPreferenceOrder.length > 0)?
                                    <div style={{width: '100%'}}>
                                        <OptionList
                                            optionIndexesById={this.props.options.indexesById}
                                            options={this.props.options.options}
                                            optionsSelectedById={this.props.optionsSelected}
                                            optionsSelectedIdsOrdered={this.props.optionsSelectedPreferenceOrder}
                                            preferenceType={this.props.choosingInstance.preference_type}
                                            showCommentsTextPerOption={this.props.choosingInstance.comments_per_option}
                                            showPreferenceValues={this.props.choosingInstance.preference}
                                            style={{paddingTop: 0}}
                                            useCode={this.props.choice.use_code}
                                        />
                                    </div>
                                :
                                    <div>No options chosen</div>
                                }
                            </div>
                            <div>
                                {(this.props.choosingInstance.comments_overall && this.props.selection.selection.comments)?
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

module.exports = SelectionConfirmed;