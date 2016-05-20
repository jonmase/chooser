import React from 'react';

import Formsy from 'formsy-react';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

import DropdownField from '../fields/dropdown.jsx';
import CommonFields from './common-fields.jsx';
import TypeSpecificFields from './type-specific-fields.jsx';

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
        var fieldTypes = [
            {
                value: 'text',
                label: 'Simple Text',
            },
            {
                value: 'wysiwyg',
                label: 'Rich Text',
            },
            {
                value: 'list',
                label: 'Option List',
            },
            {
                value: 'number',
                label: 'Number',
            },
            {
                value: 'email',
                label: 'Email',
            },
            {
                value: 'url',
                label: 'URL',
            },
            {
                value: 'date',
                label: 'Date',
            },
            {
                value: 'datetime',
                label: 'Date & Time',
            },
            {
                value: 'person',
                label: 'Person',
            },
            {
                value: 'file',
                label: 'File Upload',
            },
        ];
        
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
                <Dialog
                    autoScrollBodyContent={true}
                    modal={true}
                    onRequestClose={this.props.handlers.addDialogClose}
                    open={this.props.state.addExtraDialogOpen}
                    title="Add Extra Field"
                >
                    <p className="no-bottom-margin">Select the type of field that you want to add, and then complete the additional details.</p>
                    <Formsy.Form
                        id="add_user_form"
                        method="POST"
                        onValid={this.enableSubmitButton}
                        onInvalid={this.disableSubmitButton}
                        onValidSubmit={this.props.handlers.addSubmit}
                        noValidate
                    >
                        <DropdownField
                            field={{
                                label: "Field type",
                                name: "type",
                                options: fieldTypes,
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
                        <div style={{textAlign: 'right', marginTop: '20px'}}>
                            {actions}
                        </div>
                    </Formsy.Form>
                </Dialog>
            </span>
        );
    }
});

module.exports = AddField;