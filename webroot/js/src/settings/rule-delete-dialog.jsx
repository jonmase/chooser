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

var RuleDeleteDialog = React.createClass({
    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.deleteDialogClose}
            />,
            <FlatButton
                key="delete"
                label={this.props.containerState.ruleDeleteButtonLabel}
                onTouchTap={this.props.handlers.delete}
                primary={true}
                type="submit"
                disabled={!this.props.containerState.ruleDeleteButtonEnabled}
            />,
        ];
        
        if(this.props.containerState.ruleBeingDeleted !== null) {
            var rule = this.props.containerState.rules[this.props.containerState.ruleBeingDeleted];
            var title = "Delete Rule: " + rule.name;
        }
        
        return (
            <Dialog
                actions={actions}
                modal={false}
                onRequestClose={this.props.handlers.deleteDialogClose}
                open={this.props.containerState.ruleDeleteDialogOpen}
                style={customDialogStyle}
                title={title}
            >
                {rule?
                    <div>
                        <p>You are about to delete the following rule. This cannot be undone.</p>
                        <Text field={{label: "Name", value: rule.name}} key="name" />
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
                        <p>Select "Delete" to confirm, or "Cancel" to keep this rule.</p>
                    </div>
                :
                    <p>No rule</p>
                }
            </Dialog>
        );
    }
});

module.exports = RuleDeleteDialog;