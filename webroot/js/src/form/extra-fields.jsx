import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';
import Loader from '../elements/loader.jsx';

import CommonFields from './extra-common-fields.jsx';
import TypeSpecificFields from './extra-type-specific-fields.jsx';

import ExtraField from '../elements/fields/option-fields/extra-field.jsx';

import CategoryIcon from '../elements/icons/category.jsx';
import FilterableIcon from '../elements/icons/filterable.jsx';
import RequiredIcon from '../elements/icons/required.jsx';
import ShowToStudentsIcon from '../elements/icons/show-to-students.jsx';
import HideFromStudentsIcon from '../elements/icons/hide-from-students.jsx';
import SortableIcon from '../elements/icons/sortable.jsx';
import UserDefinedFormIcon from '../elements/icons/user-defined-form.jsx';

import AddButton from '../elements/buttons/add-button.jsx';
import AddButtonRaised from '../elements/buttons/add-button-raised.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';
import DeleteButton from '../elements/buttons/delete-button.jsx';

var ExtraFields = React.createClass({
    getInitialState: function () {
        return {
            deleteExtraDialogOpen: false,
            deleteExtraFieldId: null,
        };
    },

    handleDeleteDialogOpen: function(fieldId) {
        this.setState({
            deleteExtraDialogOpen: true,
            deleteExtraFieldId: fieldId,
        });
    },

    handleDeleteDialogClose: function() {
        this.setState({
            deleteExtraDialogOpen: false,
            deleteExtraFieldId: null,
        });
    },

    //Submit the delete extra field form
    handleDeleteSubmit: function () {
        var data = {
            id: this.state.deleteExtraFieldId,
        }
    
        console.log("Deleting extra field: " + data.id);
        
        //Save the settings
        var url = '../ExtraFields/delete';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(returnedData) {
                console.log(returnedData.response);
                
                this.setState({
                    deleteExtraDialogOpen: false,    //Close the Dialog
                    deleteExtraFieldId: null,
                });
                
                this.props.handlers.success(returnedData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                this.props.handlers.snackbarOpen('Delete error (' + err.toString() + ')');
            }.bind(this)
        }); 
    },
    
    render: function() {
        var deleteActions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.handleDeleteDialogClose}
            />,
            <FlatButton
                key="submit"
                label="Delete"
                primary={true}
                type="submit"
            />,
        ];
        
        var deleteDialog = '';
        if(this.state.deleteExtraFieldId) {
            var field = this.props.handlers.getField(this.state.deleteExtraFieldId);

            deleteDialog = 
                <FormsyDialog
                    actions={deleteActions}
                    dialogOnRequestClose={this.handleDeleteDialogClose}
                    dialogOpen={this.state.deleteExtraDialogOpen}
                    dialogTitle="Delete Extra Field?"
                    formId="delete_extra_form"
                    formOnValidSubmit={this.handleDeleteSubmit}
                >
                    <p>You are about to delete the following field:</p>
                    <p><strong>Type:</strong> {field.type.label}</p>
                    <p><strong>Label:</strong> {field.label}</p>
                    <p><strong>Instructions:</strong> {field.instructions}</p>
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
                        <AddButton
                            handleAdd={this.props.handlers.editButtonClick}
                            tooltip="Add Extra Field"
                        />
                    </div>
                </CardHeader>
                <CardText>
                    {!this.props.loaded?
                        <Loader />
                    :
                        <Formsy.Form
                            //Keep this here, as we are displaying form elements inside it, but it's not a submittable form
                            id="preview_extras_form"
                            method="POST"
                            //onValid={this.enableSubmitButton}
                            //onInvalid={this.disableSubmitButton}
                            //onValidSubmit={this.props.handlers.submit}
                            noValidate
                        >
                            {this.props.extraFields.map(function(field) {
                                return (
                                    <div className="row" key={field.label}>
                                        <div className="col-xs-6 col-md-9 col-lg-10">
                                            <ExtraField field={field} />
                                        </div>
                                        <div className="col-xs-3 col-md-2 col-lg-1" style={{margin: 'auto', textAlign: 'right'}}>
                                            {field.required?<RequiredIcon />:''}
                                            {/*field.show_to_students?<ShowToStudentsIcon />:<HideFromStudentsIcon />*/}
                                            {!field.show_to_students?<HideFromStudentsIcon />:''}
                                            {/*field.in_user_defined_form?<UserDefinedFormIcon />:''*/}
                                            {field.sortable?<SortableIcon />:''}
                                            {/*field.filterable?<FilterableIcon />:''*/}
                                            {/*field.rule_category?<CategoryIcon />:''*/}
                                        </div>
                                        <div className="col-xs-3 col-md-1" style={{margin: 'auto', textAlign: 'right'}}>
                                            <EditButton
                                                handleEdit={this.props.handlers.editButtonClick} 
                                                id={field.id}
                                                tooltip=""
                                            />
                                            <DeleteButton
                                                handleDelete={this.handleDeleteDialogOpen} 
                                                id={field.id}
                                                tooltip=""
                                            />
                                        </div>
                                    </div>
                                );
                            }, this)}
                        </Formsy.Form>
                    }
                </CardText>
                {deleteDialog}
            </Card>
        );
    }
});

module.exports = ExtraFields;