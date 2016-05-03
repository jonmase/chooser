import React from 'react';

import Formsy from 'formsy-react';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';

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
                type: 'text',
                label: 'Simple Text',
            },
            {
                type: 'wysiwyg',
                label: 'Rich Text',
            },
            {
                type: 'list',
                label: 'Option List',
            },
            {
                type: 'number',
                label: 'Number',
            },
            {
                type: 'email',
                label: 'Email',
            },
            {
                type: 'url',
                label: 'URL',
            },
            {
                type: 'date',
                label: 'Date',
            },
            {
                type: 'datetime',
                label: 'Date & Time',
            },
            {
                type: 'person',
                label: 'Person',
            },
        ];
        
        var typeMenuItems = fieldTypes.map(function(field) {
            return (
                <MenuItem value={field.type} key={field.type} primaryText={field.label} />
            );
        });
    
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
                        <FormsySelect
                            name="type"
                            required
                            floatingLabelText="Field type"
                            onChange={this.typeSelectChange}
                        >
                            {typeMenuItems}
                        </FormsySelect>
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