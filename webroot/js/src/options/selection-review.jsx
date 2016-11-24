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

import MultilineField from '../elements/fields/multiline-text.jsx';

var SelectionReview = React.createClass({
    render: function() {
        var content = <div>
            <p style={{marginTop: 0}}>
            {(this.props.instance.instance.preference_instructions)&&
                <span>{this.props.instance.instance.preference_instructions}</span>
            }
                
            {(this.props.instance.instance.comments_per_option_instructions)&&
                <span>{this.props.instance.instance.comments_per_option_instructions}</span>
            }
            </p>
            
            {(this.props.optionsSelectedPreferenceOrder.length > 0)?
                <div style={{width: '100%'}}>
                    {/*<p>You have chosen the following options:</p>*/}
                    <OptionList
                        action="confirm"
                        handleOrderChange={this.props.optionContainerHandlers.orderChange}
                        handleCommentsChange={this.props.optionContainerHandlers.optionCommentsChange}
                        instance={this.props.instance.instance}
                        optionIds={this.props.optionsSelectedPreferenceOrder}
                        options={this.props.options}
                        optionsSelected={this.props.optionsSelected}
                        rankSelectsDisabled={this.props.rankSelectsDisabled}
                        removeButton={false}
                        useCode={this.props.choice.use_code}
                    />
                </div>
            :
                <div>No options chosen</div>
            }
            
            {(this.props.instance.instance.comments_overall)?
                <MultilineField field={{
                    label: "Comments",
                    instructions: this.props.instance.instance.comments_overall_instructions,
                    name: "selection.comments",
                    onChange: this.props.optionContainerHandlers.overallCommentsChange,
                    section: true,
                    value: this.props.selection.selection.comments,
                }} />
            :""}
            
            <EditableWarning
                instance={this.props.instance.instance}
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