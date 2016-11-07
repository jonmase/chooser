import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import Warnings from './selection-warnings.jsx';
import EditableWarning from './selection-editable-warning.jsx';

var SelectionConfirmDialog = React.createClass({
    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                onTouchTap={this.props.handlers.close}
                secondary={true}
            />,
            <FlatButton
                key="submit"
                label="Confirm"
                onTouchTap={this.props.handlers.submit}
                primary={true}
                type="submit"
            />,
        ];
        
        return (
            <Dialog
                actions={actions}
                autoScrollBodyContent={true}
                modal={true}
                onRequestClose={this.props.handlers.close}
                open={this.props.open}
                title="Confirm Submission"
            >
                <Warnings
                    rules={this.props.rules}
                    ruleWarnings={this.props.selection.ruleWarnings}
                />

                <EditableWarning
                    instance={this.props.instance.instance}
                />
            </Dialog>
        );
    }
});

module.exports = SelectionConfirmDialog;