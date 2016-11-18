import React from 'react';

import OptionList from './option-list.jsx';
import Warnings from './selection-warnings.jsx';
import EditableWarning from './selection-editable-warning.jsx';

import MultilineField from '../elements/fields/multiline-text.jsx';

var SelectionConfirm = React.createClass({
    render: function() {
        return (
            <div>
                <div className="warnings">
                    <Warnings
                        allowSubmit={this.props.selection.allowSubmit}
                        rules={this.props.rules}
                        ruleWarnings={this.props.selection.ruleWarnings}
                    />
                    
                    <EditableWarning
                        instance={this.props.instance.instance}
                    />
                </div>
                
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
            </div>
        );
    }
});

module.exports = SelectionConfirm;