import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import FormsyToggle from 'formsy-material-ui/lib/FormsyToggle';

import FormsyDialog from '../elements/formsy-dialog.jsx';

var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var OptionFilterDialog = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
        };
    },

    enableSubmitButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false
        });
    },

    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.dialogClose}
            />,
            <FlatButton
                key="clear"
                label="Clear"
                secondary={true}
                onTouchTap={this.props.handlers.clear}
            />,
            <FlatButton
                key="submit"
                label="Filter"
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit}
            />,
        ];
        
        return (
            <FormsyDialog
                actions={actions}
                contentStyle={customDialogStyle}
                dialogOnRequestClose={this.props.handlers.dialogClose}
                dialogOpen={this.props.dialogOpen}
                dialogTitle="Filter Options"
                formId="option_filter_form"
                formOnValid={this.enableSubmitButton}
                formOnInvalid={this.disableSubmitButton}
                formOnValidSubmit={this.props.handlers.submit}
            >
                <FormsyToggle
                    defaultToggled={false}
                    label="Selected"
                    labelPosition="right"
                    name="selected"
                />
            </FormsyDialog>
        );
    }
});

module.exports = OptionFilterDialog;