import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

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
                    <p>{rule.name}</p>
                :
                    <p>No rule</p>
                }
            </Dialog>
        );
    }
});

module.exports = RuleViewDialog;