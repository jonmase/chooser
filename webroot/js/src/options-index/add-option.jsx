import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';
import FieldLabel from '../elements/label.jsx';
import DefaultFields from '../options-form/default-fields.jsx';

var AddOption = React.createClass({
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
                key="submit"
                label="Submit"
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit}
            />,
        ];
        
        
        return (
            <span>
                <IconButton
                    tooltip="Add Option"
                    onTouchTap={this.props.handlers.dialogOpen}
                    iconClassName="material-icons"
                >
                    add
                </IconButton>         
                <FormsyDialog
                    actions={actions}
                    dialogOnRequestClose={this.props.handlers.dialogClose}
                    dialogOpen={this.props.state.addOptionDialogOpen}
                    dialogTitle="Add Option"
                    formId="add_option_form"
                    formOnValid={this.enableSubmitButton}
                    formOnInvalid={this.disableSubmitButton}
                    formOnValidSubmit={this.props.handlers.submit}
                >
                    <div className="section">
                        <DefaultFields
                            defaults={this.props.state.defaults}
                        />
                    </div>
                </FormsyDialog>
            </span>
        );
    }
});

module.exports = AddOption;