import React from 'react';

import Paper from 'material-ui/Paper';

import OptionList from './option-list.jsx';
import Warnings from './selection-warnings.jsx';
import EditableWarning from './selection-editable-warning.jsx';

import MultilineField from '../elements/fields/multiline-text.jsx';

var SelectionConfirm = React.createClass({
    render: function() {
        var content = <div>
            <EditableWarning
                instance={this.props.instance.instance}
            />
            
            {(this.props.instance.instance.preference_instructions)&&
                <p>{this.props.instance.instance.preference_instructions}</p>
            }
                
            {(this.props.instance.instance.comments_per_option_instructions)&&
                <p>{this.props.instance.instance.comments_per_option_instructions}</p>
            }
        
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
        </div>;
    
        return (
            <div>
                <Warnings
                    allowSubmit={this.props.selection.allowSubmit}
                    rules={this.props.rules}
                    ruleWarnings={this.props.selection.ruleWarnings}
                />
                
                {(this.props.selection.ruleWarnings)?
                    <Paper rounded={false} zDepth={2} style={{padding: '16px', margin: '15px 0'}}>
                        {content}
                    </Paper>
                :
                    content
                }
            </div>
        );
    }
});

module.exports = SelectionConfirm;