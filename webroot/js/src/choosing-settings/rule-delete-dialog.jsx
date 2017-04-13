import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import Text from '../elements/display/text-labelled.jsx';
import Toggle from '../elements/display/toggle-labelled.jsx';

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
                onTouchTap={this.props.handlers.dialogClose}
            />,
            <FlatButton
                key="delete"
                label={this.props.deleteButtonLabel}
                onTouchTap={this.props.handlers.delete}
                primary={true}
                type="submit"
                disabled={!this.props.deleteButtonEnabled}
            />,
        ];
        
        if(this.props.ruleBeingDeleted !== null) {
            var rule = this.props.rules[this.props.ruleBeingDeleted];
            var title = "Delete Rule: " + rule.name;
        }
        
        return (
            <Dialog
                actions={actions}
                modal={false}
                onRequestClose={this.props.handlers.dialogClose}
                open={this.props.deleteDialogOpen}
                style={customDialogStyle}
                title={title}
            >
                {rule?
                    <div>
                        <p>You are about to delete the following rule. This cannot be undone.</p>
                        <Text label="Name" value={rule.name} key="name" />
                        <Text label="Type" value={rule.type.charAt(0).toUpperCase() + rule.type.slice(1)} key="type" />
                        
                        {(rule.type === 'points' || rule.type === 'number')?
                            <Text 
                                label="Alowed Values"
                                value={rule.values}
                                key="values" 
                            />
                        :""}
                        
                        <Text 
                            label="Scope"
                            value={rule.scope_text}
                            key="scope" 
                        />
                        <Toggle
                            label="Hard Rule?"
                            value={rule.hard}
                            explanation={"Students can" + (rule.hard?"not submit":" still submit even") + " if they do not fulfil this rule" + (rule.hard?"":", but will be shown a warning")}
                        />
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