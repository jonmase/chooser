import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

var OptionUnpublishApprovedWarningDialog = React.createClass({
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
                title="Confirm Unpublish"
            >
                <p style={{marginBottom: 0}}>
                    This option has already been approved. If you unpublish it, it will need to be republished and then re-approved before it is visible to students. Are you sure you want to unpublish this option?
                </p>
            </Dialog>
        );
    }
});

module.exports = OptionUnpublishApprovedWarningDialog;