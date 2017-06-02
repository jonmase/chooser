import React from 'react';

import Formsy from 'formsy-react';
import MultilineTextField from '../elements/fields/multiline-text.jsx';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

var OptionRejectDialog = React.createClass({
    handleSubmit: function() {
        this.refs.reject.submit();
    },

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
                label="Reject Option"
                onTouchTap={this.handleSubmit}
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
                title="Reject Option?"
            >
                <p>
                    Please add some comments to explain to the author(s) your reasons for rejecting this option and what they would need to do for it to be approved, then confirm your decision.
                </p>
                <Formsy.Form 
                    id="reject_form"
                    method="POST"
                    noValidate={true}
                    //onValid={this.enableSaveButton}
                    //onInvalid={this.disableSaveButton}
                    onSubmit={this.props.handlers.submit}
                    ref="reject"
                >
                    <MultilineTextField
                        field={{
                            defaultValue: this.props.option.approver_comments,
                            label: "Comments",
                            instructions: "",
                            name: "comments",
                            section: false,
                        }}
                    />
                </Formsy.Form>
            </Dialog>
        );
    }
});

module.exports = OptionRejectDialog;