import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';

import DropdownField from '../fields/dropdown.jsx';
import CommonFields from './extra-common-fields.jsx';
import TypeSpecificFields from './extra-type-specific-fields.jsx';

var AddField = React.createClass({
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
                onTouchTap={this.props.handlers.addDialogClose}
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
                    iconClassName="material-icons"
                    onTouchTap={this.props.handlers.addDialogOpen}
                    tooltip="Add Field"
                >
                    add
                </IconButton>
                <FormsyDialog
                    actions={actions}
                    dialogOnRequestClose={this.props.handlers.addDialogClose}
                    dialogOpen={this.props.state.addExtraDialogOpen}
                    dialogTitle="Add Extra Field"
                    formId="add_extra_form"
                    formOnValid={this.enableSubmitButton}
                    formOnInvalid={this.disableSubmitButton}
                    formOnValidSubmit={this.props.handlers.addSubmit}
                >
                    <p className="no-bottom-margin">Select the type of field that you want to add, and then complete the additional details.</p>
                    <DropdownField
                        field={{
                            label: "Field type",
                            name: "type",
                            options: this.props.fieldTypes,
                            required: true,
                        }}
                        onChange={this.props.handlers.typeChange}
                    />
                    <CommonFields
                        type={this.props.state.addType}
                    />
                    <TypeSpecificFields
                        type={this.props.state.addType}
                    />
                </FormsyDialog>
            </span>
        );
    }
});

module.exports = AddField;