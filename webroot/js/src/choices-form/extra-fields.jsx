import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';

import AddField from './add-field.jsx';
import CommonFields from './common-fields.jsx';
import TypeSpecificFields from './type-specific-fields.jsx';

import TextField from '../fields/text.jsx';
import NumericField from '../fields/numeric.jsx';
import EmailField from '../fields/email.jsx';
import UrlField from '../fields/url.jsx';
import Wysiwyg from '../fields/wysiwyg.jsx';
import RadioField from '../fields/radio.jsx';
import CheckboxField from '../fields/checkbox.jsx';
import DropdownField from '../fields/dropdown.jsx';
import DateTimeField from '../fields/datetime.jsx';
import PersonField from '../fields/person.jsx';
import FileField from '../fields/file.jsx';

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
    {
        value: 'person',
        label: 'Person',
    },
    {
        value: 'file',
        label: 'File Upload',
    },
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
            var editField = this.props.state.extraFields[this.props.state.extraFieldIdsIndexes[this.props.state.editExtraFieldId]];

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
            var deleteField = this.props.state.extraFields[this.props.state.extraFieldIdsIndexes[this.props.state.deleteExtraFieldId]];
            var fieldType = '';
            fieldTypes.some(function(type) {
                if(type.value === deleteField.type) {
                    fieldType = type;
                }
            });

            editDialog = 
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
                            var fieldComponent = null;
                            
                            field.section = true;
                            switch(field.type) {
                                case 'text': 
                                    fieldComponent = <TextField field={field} />;
                                    break;
                                case 'wysiwyg': 
                                    fieldComponent = <Wysiwyg field={field} />;
                                    break;
                                case 'number': 
                                    fieldComponent = <NumericField field={field} />;
                                    break;
                                case 'email': 
                                    fieldComponent = <EmailField field={field} />;
                                    break;
                                case 'url': 
                                    fieldComponent = <UrlField field={field} />;
                                    break;
                                case 'list':
                                    switch(field.extra.list_type) {
                                        case 'radio': 
                                            fieldComponent = <RadioField field={field} />;
                                            break;
                                        case 'checkbox': 
                                            fieldComponent = <CheckboxField field={field} />;
                                            break;
                                        case 'dropdown': 
                                            fieldComponent = <DropdownField field={field} />;
                                            break;
                                    }
                                    break;
                                case 'datetime': 
                                    var time = true;
                                case 'date': 
                                    fieldComponent = <DateTimeField field={field} time={time} />;
                                    break;
                                case 'person':
                                    fieldComponent = <PersonField field={field} />;
                                    break;
                                case 'file':
                                    fieldComponent = <FileField field={field} />;
                                    break;
                                default:
                                    fieldComponent = 
                                        <div>Count not display field ({field.type}: {field.label})</div>;
                                    break;
                            }
                            
                            return (
                                <div className="row" key={field.label}>
                                    <div className="col-xs-6 col-md-9 col-lg-10">
                                        {fieldComponent}
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
                                        <IconButton tooltip={'Edit ' + field.label + ' Field'} id={field.name} onTouchTap={this.props.handlers.editDialogOpen} >
                                            <FontIcon className="material-icons">edit</FontIcon>
                                        </IconButton>
                                        <IconButton tooltip={'Delete ' + field.label + ' Field'} id={field.name} onTouchTap={this.props.handlers.deleteDialogOpen} >
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