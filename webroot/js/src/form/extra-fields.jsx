import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';

import AddField from './extra-add-field.jsx';
import CommonFields from './extra-common-fields.jsx';
import TypeSpecificFields from './extra-type-specific-fields.jsx';

import ExtraField from '../option-fields/extra-field.jsx';

import CategoryIcon from '../icons/category.jsx';
import FilterableIcon from '../icons/filterable.jsx';
import RequiredIcon from '../icons/required.jsx';
import ShowToStudentsIcon from '../icons/show-to-students.jsx';
import SortableIcon from '../icons/sortable.jsx';
import UserDefinedFormIcon from '../icons/user-defined-form.jsx';

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
    /*{
        value: 'person',
        label: 'Person',
    },*/
    /*{
        value: 'file',
        label: 'File Upload',
    },*/
];


var ExtraFields = React.createClass({
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

    getFieldType: function(searchType) {
        var fieldType = '';
        fieldTypes.some(function(type) {
            if(type.value === searchType) {
                fieldType = type;
            }
        });
        return fieldType;
    },
    
    render: function() {
        var editActions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.editDialogClose}
            />,
            <FlatButton
                key="submit"
                label="Submit"
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit}
            />,
        ];
        
        var editDialog = '';
        if(this.props.state.editExtraFieldId) {
            var editField = this.props.state.extraFields[this.props.state.extraFieldIndexesById[this.props.state.editExtraFieldId]];
            var fieldType = this.getFieldType(editField.type);
            
            editDialog = 
                <FormsyDialog
                    actions={editActions}
                    dialogOnRequestClose={this.props.handlers.editDialogClose}
                    dialogOpen={this.props.state.editExtraDialogOpen}
                    dialogTitle="Edit Extra Field"
                    formId="edit_extra_form"
                    formOnValid={this.enableSubmitButton}
                    formOnInvalid={this.disableSubmitButton}
                    formOnValidSubmit={this.props.handlers.editSubmit}
                >
                    <p>
                        <strong>Type:</strong> {fieldType.label} <br />
                        <span className="sublabel">(You can't change this. If you want to change the field type, you will have to delete this field and then add the new one.)</span>
                    </p>
                    <CommonFields
                        type={editField.type}
                        values={editField}
                    />
                    <TypeSpecificFields
                        type={editField.type}
                        values={editField}
                    />
                </FormsyDialog>
        }

        var deleteActions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.deleteDialogClose}
            />,
            <FlatButton
                key="submit"
                label="Delete"
                primary={true}
                type="submit"
            />,
        ];
        
        var deleteDialog = '';
        if(this.props.state.deleteExtraFieldId) {
            var deleteField = this.props.state.extraFields[this.props.state.extraFieldIndexesById[this.props.state.deleteExtraFieldId]];
            var fieldType = this.getFieldType(deleteField.type);

            deleteDialog = 
                <FormsyDialog
                    actions={deleteActions}
                    dialogOnRequestClose={this.props.handlers.deleteDialogClose}
                    dialogOpen={this.props.state.deleteExtraDialogOpen}
                    dialogTitle="Delete Extra Field?"
                    formId="delete_extra_form"
                    formOnValidSubmit={this.props.handlers.deleteSubmit}
                >
                    <p>You are about to delete the following field:</p>
                    <p><strong>Type:</strong> {fieldType.label}</p>
                    <p><strong>Label:</strong> {deleteField.label}</p>
                    <p><strong>Instructions:</strong> {deleteField.instructions}</p>
                    <p> This cannot be undone, and any option data for this field will be lost. Are you sure you wish to delete this field?</p>
                </FormsyDialog>
        }

        return (
            <Card 
                className="page-card"
            >
                <CardHeader
                    title="Extra Fields"
                    subtitle="Add custom fields to the options form for this Choice"
                >
                    <div style={{float: 'right'}}>
                        <AddField 
                            state={this.props.state} 
                            handlers={this.props.handlers}
                            fieldTypes={fieldTypes}
                        />
                    </div>
                </CardHeader>
                <CardText>
                    <Formsy.Form
                        id="preview_extras_form"
                        method="POST"
                        //onValid={this.enableSubmitButton}
                        //onInvalid={this.disableSubmitButton}
                        //onValidSubmit={this.props.handlers.submit}
                        noValidate
                    >
                        {this.props.state.extraFields.map(function(field) {
                            return (
                                <div className="row" key={field.label}>
                                    <div className="col-xs-6 col-md-9 col-lg-10">
                                        <ExtraField field={field} />
                                    </div>
                                    <div className="col-xs-3 col-md-2 col-lg-1" style={{margin: 'auto', textAlign: 'right'}}>
                                        {field.required?<RequiredIcon />:''}
                                        {field.show_to_students?<ShowToStudentsIcon />:''}
                                        {field.in_user_defined_form?<UserDefinedFormIcon />:''}
                                        {field.sortable?<SortableIcon />:''}
                                        {field.filterable?<FilterableIcon />:''}
                                        {field.rule_category?<CategoryIcon />:''}
                                    </div>
                                    <div className="col-xs-3 col-md-1" style={{margin: 'auto', textAlign: 'right'}}>
                                        <IconButton tooltip={'Edit ' + field.label + ' Field'} id={'extra_field_' + field.id} onTouchTap={this.props.handlers.editDialogOpen} >
                                            <FontIcon className="material-icons">edit</FontIcon>
                                        </IconButton>
                                        <IconButton tooltip={'Delete ' + field.label + ' Field'} id={'extra_field_' + field.id} onTouchTap={this.props.handlers.deleteDialogOpen} >
                                            <FontIcon className="material-icons">delete</FontIcon>
                                        </IconButton>
                                    </div>
                                </div>
                            );
                        }, this)}
                    </Formsy.Form>
                </CardText>
                {editDialog}
                {deleteDialog}
            </Card>
        );
    }
});

module.exports = ExtraFields;