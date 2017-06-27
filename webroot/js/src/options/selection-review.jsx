import React from 'react';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';

import OptionList from './option-list.jsx';
import Warnings from './selection-warnings.jsx';
import WarningsTitle from './selection-warnings-title.jsx';
import WarningsExplanation from './selection-warnings-explanation.jsx';
import WarningIcon from '../elements/icons/warning.jsx';
import EditableWarning from './selection-editable-warning.jsx';

import MultilineField from '../elements/fields/multiline-text-instructions.jsx';

var SelectionReview = React.createClass({
    render: function() {
        var content = <div>
            <p style={{marginTop: 0}}>
                {(this.props.choosingInstance.review_instructions)&&
                    <span>{this.props.choosingInstance.review_instructions}</span>
                }
            </p>
                    
            {/*<p style={{marginTop: 0}}>
                {(this.props.choosingInstance.preference_instructions)&&
                    <span>{this.props.choosingInstance.preference_instructions}</span>
                }
            </p>
                    
            <p style={{marginTop: 0}}>
                {(this.props.choosingInstance.comments_per_option && this.props.choosingInstance.comments_per_option_instructions)&&
                    <span>{this.props.choosingInstance.comments_per_option_instructions}</span>
                }
            </p>*/}
            
            <div style={{width: '100%', marginBottom: '20px'}}>
                {(this.props.optionsSelectedPreferenceOrder.length > 0)?
                    <div>
                        <p style={{marginBottom: 0}}>You have chosen the following options:</p>
                        <OptionList
                            handleOrderChange={this.props.optionContainerHandlers.orderChange}
                            handleCommentsChange={this.props.optionContainerHandlers.optionCommentsChange}
                            hiddenOptionIdField={true}
                            optionIndexesById={this.props.options.indexesById}
                            options={this.props.options.options}
                            optionsSelectedById={this.props.optionsSelected}
                            optionsSelectedIdsOrdered={this.props.optionsSelectedPreferenceOrder}
                            preferenceType={this.props.choosingInstance.preference_type}
                            rankSelectsDisabled={this.props.rankSelectsDisabled}
                            showCommentsFieldPerOption={this.props.choosingInstance.comments_per_option}
                            showPreferenceInputs={this.props.choosingInstance.preference}
                            useCode={this.props.choice.use_code}
                        />
                    </div>
                :
                    <span>No options chosen</span>
                }
            </div>
            
            {(this.props.choosingInstance.comments_overall)?
                <MultilineField field={{
                    label: "Comments",
                    instructions: this.props.choosingInstance.comments_overall_instructions,
                    name: "selection.comments",
                    onChange: this.props.optionContainerHandlers.overallCommentsChange,
                    section: true,
                    value: this.props.selection.selection.comments,
                }} />
            :""}
            
            <EditableWarning
                choosingInstance={this.props.choosingInstance}
            />
        </div>;
    
        return (
            <div>
                {(this.props.selection.ruleWarnings)&&
                    <Card className="page-card">
                        <CardHeader 
                            avatar={<Avatar icon={<WarningIcon colour="orange" large={true} />} backgroundColor='#fff' />}
                            title={<WarningsTitle 
                                allowSubmit={this.props.selection.allowSubmit}
                                ruleWarnings={this.props.selection.ruleWarnings}
                            />}
                            subtitle={<WarningsExplanation 
                                allowSubmit={this.props.selection.allowSubmit}
                                ruleWarnings={this.props.selection.ruleWarnings}
                            />}
                        />
                        <CardText style={{paddingTop: 0}}>
                            <Warnings
                                allowSubmit={this.props.selection.allowSubmit}
                                rules={this.props.rules}
                                ruleWarnings={this.props.selection.ruleWarnings}
                            />
                        </CardText>
                    </Card>
                }
                
                {/*(this.props.selection.ruleWarnings)?
                    <Paper rounded={paperRounded} zDepth={paperDepth} style={paperStyle}>*/}
                <Card className="page-card">
                    <CardHeader title="Your Choices" />
                    <CardText style={{paddingTop: 0}}>
                        {content}
                    </CardText>
                    <CardActions>
                        <RaisedButton 
                            label="Submit" 
                            onTouchTap={this.props.optionContainerHandlers.confirm} 
                            primary={true} 
                        />
                        <FlatButton 
                            label="Change Choices" 
                            onTouchTap={this.props.optionContainerHandlers.change} 
                        />
                    </CardActions>
                </Card>
                    {/*</Paper>
                :
                    content
                */}
            </div>
        );
    }
});

module.exports = SelectionReview;