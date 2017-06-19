import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

var OptionEditApprovedWarningDialog = React.createClass({
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
                title="Confirm Save"
            >
                <p style={{marginBottom: 0}}>
                    If you save your changes to this option, it will need to be re-approved before it is visible to students. Are you sure you want to Save these changes?
                </p>
            </Dialog>
        );
    }
});

module.exports = OptionEditApprovedWarningDialog;