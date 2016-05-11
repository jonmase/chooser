import React from 'react';

import Formsy from 'formsy-react';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';

import DropdownField from '../fields/dropdown.jsx';
import CommonFields from './common-fields.jsx';
import ListFields from './list-fields.jsx';
import NumberFields from './number-fields.jsx';

var AddField = React.createClass({
    getInitialState: function () {
        return {
            canSubmit: false,
            type: null,
        };
    },

   handleDialogClose: function () {
        this.setState({
            type: null,
        });
        this.props.handlers.dialogClose();
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

    typeSelectChange: function (event, value) {
        console.log("Field type changed to " + value);
        this.setState({
            type: value,
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
        ];
        
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleDialogClose}
            />,
            <FlatButton
                key="submit"
                label="Submit"
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit}
            />,
        ];
        
        var typeSpecific = '';
        if(this.state.type === 'list') {
            typeSpecific = 
                <ListFields
                    state={this.props.state}
                    type={this.state.type}
                />;
        }
        else if(this.state.type === 'number') {
            typeSpecific = 
                <NumberFields
                    state={this.props.state}
                    type={this.state.type}
                />;
        }
        
        
        return (
            <span>
                <IconButton
                    tooltip="Add Field"
                    onTouchTap={this.props.handlers.dialogOpen}
                    iconClassName="material-icons"
                >
                    add
                </IconButton>         
                <Dialog
                    title="Add Extra Field"
                    open={this.props.state.extraDialogOpen}
                    onRequestClose={this.handleDialogClose}
                    autoScrollBodyContent={true}
                    modal={true}
                >
                    <p className="no-bottom-margin">Select the type of field that you want to add, and then complete the additional details.</p>
                    <Formsy.Form
                        id="add_user_form"
                        method="POST"
                        onValid={this.enableSubmitButton}
                        onInvalid={this.disableSubmitButton}
                        onValidSubmit={this.props.handlers.submit}
                        noValidate
                    >
                        <DropdownField
                            name="type"
                            options={fieldTypes}
                            required={true}
                            label="Field type"
                            onChange={this.typeSelectChange}
                        />
                        <CommonFields
                            state={this.props.state}
                            type={this.state.type}
                        />
                        {typeSpecific}
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