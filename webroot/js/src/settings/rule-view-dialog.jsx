import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import Text from '../elements/display/text.jsx';
import Wysiwyg from '../elements/display/wysiwyg.jsx';
import Numeric from '../elements/display/numeric.jsx';
import Toggle from '../elements/display/toggle.jsx';

var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var RuleViewDialog = React.createClass({
    render: function() {
        var actions = [
            <FlatButton
                key="close"
                label="Close"
                secondary={false}
                onTouchTap={this.props.handlers.dialogClose}
            />,
        ];
        
        if(this.props.rulesState.ruleBeingViewed !== null) {
            var rule = this.props.containerState.rules[this.props.rulesState.ruleBeingViewed];
            var title = "Rule: " + rule.name;
        }
        else {
            var rule = null;
            var title = "Rule";
        }
        
        return (
            <Dialog
                actions={actions}
                modal={false}
                onRequestClose={this.props.handlers.dialogClose}
                open={this.props.rulesState.ruleViewDialogOpen}
                style={customDialogStyle}
                title={title}
            >
                {rule?
                    <div>
                        <Text field={{label: "Name", value: rule.name}} key="name" />
                        <Wysiwyg field={{label: "Instructions", value: rule.instructions}} key="instructions" />
                        <Wysiwyg field={{label: "Warning", value: rule.warning}} key="warning" />
                        <Text field={{label: "Type", value: rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}} key="type" />
                        
                        {(rule.type === 'points' || rule.type === 'number')?
                            <Text 
                                field={{
                                    label: "Alowed Values", 
                                    value: rule.values,
                                }} 
                                key="values" 
                            />
                        :""}
                        
                        <Text 
                            field={{
                                label: "Scope", 
                                value: rule.scope_text,
                            }} 
                            key="scope" 
                        />
                        <Toggle field={{
                            label: "Hard Rule?", 
                            value: rule.hard, 
                            explanation: "Students can" + (rule.hard?"not submit":" still submit even") + " if they do not fulfil this rule" + (rule.hard?"":", but will be shown a warning"),
                        }} />
                    </div>
                :
                    <p>No rule</p>
                }
            </Dialog>
        );
    }
});

module.exports = RuleViewDialog;