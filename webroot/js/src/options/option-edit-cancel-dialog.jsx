import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

var OptionEditCancelDialog = React.createClass({
    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Continue Editing"
                onTouchTap={this.props.handlers.close}
                secondary={true}
            />,
            <FlatButton
                key="submit"
                label="Discard Changes"
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
                title="Discard Changes?"
            >
                <p>
                    Are you sure you want to discard any changes you have made to this option? Discarded changes cannot be recovered. 
                </p>
            </Dialog>
        );
    }
});

module.exports = OptionEditCancelDialog;