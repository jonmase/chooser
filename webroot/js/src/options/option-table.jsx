import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';

import ExtraField from './extra-field.jsx';
import WarningDialog from './option-unpublish-approved-warning-dialog.jsx';

import AddButton from '../elements/buttons/add-button.jsx';
import AddButtonRaised from '../elements/buttons/add-button-raised.jsx';
import ApprovalButton from '../elements/buttons/approval-button.jsx';
import DeleteButton from '../elements/buttons/delete-button.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';
import ExpandButton from '../elements/buttons/expand-button.jsx';
import FavouriteButton from './option-favourite-button.jsx';
import PublishButton from '../elements/buttons/publish-button.jsx';
import RestoreButton from '../elements/buttons/restore-button.jsx';
import UnpublishButton from '../elements/buttons/unpublish-button.jsx';

import SortableTableHeaderColumn from '../elements/table/sortable-header.jsx';
import UnselectableCell from '../elements/table/unselectable-cell.jsx';
import FieldsWrapper from '../elements/wrappers/fields.jsx';

//TODO: Sort out title styles, and keep these styles DRY
var styles = {
    tableRowColumn: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    actionsTableRowColumn: {
        paddingLeft: 0,
        paddingRight: 0,
        textAlign: 'right',
        whiteSpace: 'normal',
        width: '48px',
    },
    /*actionsButtons: {
        width: '48px',
        paddingLeft: '6px',
        paddingRight: '6px',
    },*/
    favouriteTableRowColumn: {
        paddingLeft: '12px',
        paddingRight: '12px',
        whiteSpace: 'normal',
        width: '48px',
    },
    cardText: {
        paddingTop: '0px',
    }
};

styles.tableRowColumnTitle = Object.assign({}, styles.tableRowColumn, {minWidth: '30%'});
styles.publishedTableRowColumn = Object.assign({}, styles.tableRowColumn, {width: '72px', textAlign: 'center'});
styles.editorActionsTableRowColumn = Object.assign({}, styles.actionsTableRowColumn, {width: '144px'});
//styles.editorActionsTableRowColumn = Object.assign({}, styles.actionsTableRowColumn, {width: '96px'});  //Delete removed
styles.approverActionsTableRowColumn = Object.assign({}, styles.actionsTableRowColumn, {width: '48px'});
styles.adminActionsTableRowColumn = Object.assign({}, styles.actionsTableRowColumn, {width: '192px'});
//styles.adminActionsTableRowColumn = Object.assign({}, styles.actionsTableRowColumn, {width: '144px'});  //Delete removed
    
var OptionsTable = React.createClass({
    getInitialState: function () {
        var initialState = {
            optionId: null,
            warningDialogOpen: false,
        };
        
        return initialState;
    },
    
    _onRowSelection: function(selectedRows){
        this.props.optionContainerHandlers.selectOption(selectedRows);
    },
    
    handleDelete: function(optionId) {
        this.props.optionContainerHandlers.changeStatus('delete', optionId, true);
    },
    
    handlePublish: function(optionId) {
        this.props.optionContainerHandlers.changeStatus('publish', optionId, true);
    },
    
    handleRestore: function(optionId) {
        this.props.optionContainerHandlers.changeStatus('delete', optionId, false);
    },
    
    handleUnpublish: function(optionId) {
        //If option has already been approved, warn that it will need reapproval
        var option = this.props.options.options[this.props.options.indexesById[optionId]];
        if(option.approved) {
            this.setState({
                optionId: optionId,
                warningDialogOpen: true,
            });
        }
        else {
            this.unpublishOption(optionId);
        }
        
    },
    
    handleWarningDialogClose: function() {
        this.setState({
            warningDialogOpen: false,
        });
    },

    handleWarningDialogSubmit: function() {
        this.setState({
            warningDialogOpen: false,
        }, this.unpublishOption(this.state.optionId));
    },

    isAdmin: function() {
        if(this.props.roles.indexOf('admin') > -1) {
            return true;
        }
        else {
            return false;
        }
    },
    isApprover: function() {
        if(this.props.instance.editing.approval_required && (this.props.roles.indexOf('admin') > -1 || this.props.roles.indexOf('approver') > -1)) {
            return true;
        }
        else {
            return false;
        }
    },
    isEditor: function() {
        if(this.props.roles.indexOf('admin') > -1 || this.props.roles.indexOf('editor') > -1) {
            return true;
        }
        else {
            return false;
        }
    },
    isEditorOrApprover: function() {
        if(this.isEditor() || this.isApprover()) {
            return true;
        }
        else {
            return false;
        }
    },
    
    unpublishOption: function(optionId) {
        this.props.optionContainerHandlers.changeStatus('publish', optionId, false);
    },
    
    render: function() {
        var enableSelection = true;
        switch(this.props.action) {
            case 'edit':
                var title = 'Options';
                var isAdmin = this.isAdmin();
                var isApprover = this.isApprover();
                var isEditor = this.isEditor();
                if(isEditor) {
                    var subtitle = 'Create, edit';
                    if(isApprover) {
                        subtitle += ', manage and approve';
                        //If this user has one or more editable options and editing is open, make the actions column wide enough for edit and approve actions
                        if(isAdmin || (this.props.options.editableOptionsCount > 0 && this.props.instance.editing.editing_open)) {
                            var actionsColStyles = styles.adminActionsTableRowColumn;
                        }
                        //Otherwise, actions column only need to be wide enough for approve action
                        else {
                            var actionsColStyles = styles.approverActionsTableRowColumn;
                        }
                    }
                    else {
                        subtitle += ' and manage';
                        var actionsColStyles = styles.editorActionsTableRowColumn;
                    }
                    subtitle += ' options';
                    
                    if(isApprover && !isAdmin && !this.props.instance.editing.editing_open) {
                        subtitle += ' (Note that the editing deadline has passed, so you can only approve options)';
                    }
                }
                else if(isApprover) {
                    var subtitle = 'View and approve options';
                    var actionsColStyles = styles.approverActionsTableRowColumn;
                }
                enableSelection = false;
                break;
            case 'view':
                var title = 'Choose Options';
                //var subtitle = 'Choose options using the tick boxes. Shortlist them using the stars. Sort the options using the table headings. Review and submit your choices using the button in the top right. ';
                var subtitle = 'Choose options using the tick boxes. Sort the options using the table headings. Review and submit your choices using the button in the top right.';
                enableSelection = this.props.instance.choosing.id?true:false;
                break;
            default:
                var title = false;
                var subtitle = false;
                break;
        }
        
        //Set visibility of favouritese, published, approved, expand and actions columns
        //var showFavouritesColumn = this.props.action === 'view' && enableSelection;
        var showFavouritesColumn = false;
        var showPublishedColumn = this.props.action === 'edit';
        var showApprovedColumn = this.props.action === 'edit' && this.props.instance.editing.approval_required;
        var showExpandColumn = this.props.choice.use_description;   //Initially set whether expand column should be shown based on whether description is used
        var showActionsColumn = this.props.action === 'edit' && (this.isApprover() || this.props.options.editableOptionsCount > 0 || this.isAdmin());
        
        var defaultsExceptDescription = this.props.getDefaultFieldsForChoice(this.props.choice, ['description']);
        var defaultFields = [];
        defaultsExceptDescription.forEach(function(field) {
            if(field.name === 'title') {
                var rowStyle = styles.tableRowColumnTitle;
            }
            else {
                var rowStyle = styles.tableRowColumn;
            }
            
            defaultFields.push({
                name: field.name,
                label: field.label,
                type: field.type,
                rowStyle: rowStyle,
            });
        }, this);
        
        var sortableExtraFields = [];
        var filterableExtraFields = [];
        
        this.props.choice.extra_fields.forEach(function(field, index) {
            //If field is sortable, add it to the array of sortable fields
            if(field.sortable) {
                sortableExtraFields.push(index);
            }
            //Otherwise, field will not be shown, so need to show expand button, if not already doing so
            else if(!showExpandColumn) {
                showExpandColumn = true;
            }
            if(field.filterable) {
                filterableExtraFields.push(index);
            }
        });
        
        return (
            <div>
                <Card 
                    className="page-card"
                    //initiallyExpanded={true}
                >
                    <div style={{float: 'right'}}>
                        {(this.props.action === 'edit')&&
                            <AddButton 
                                handleClick={this.props.optionContainerHandlers.edit} 
                                tooltip="Add Option"
                            />
                        }
                    </div>
                    <CardHeader
                        //actAsExpander={true}
                        //showExpandableButton={true}
                        style={{marginRight: '48px'}}
                        textStyle={{paddingRight: 0}}
                        title={title}
                        subtitle={subtitle}
                    />
                    <CardText 
                        //expandable={true}
                        style={styles.cardText}
                    >
                        {(this.props.options.options.length == 0)?
                            (this.props.action === 'edit')?
                                <div>
                                    <p>You have not created any options yet.</p>
                                    <AddButtonRaised 
                                        handleClick={this.props.optionContainerHandlers.edit} 
                                        label="Add Option"
                                    />
                                </div>
                            :
                                <p>There are no options to show.</p>
                        :
                            <Table 
                                selectable={enableSelection}
                                multiSelectable={true}
                                onRowSelection={this._onRowSelection}
                            >
                                <TableHeader 
                                    adjustForCheckbox={enableSelection} 
                                    displaySelectAll={enableSelection}
                                >
                                    <TableRow>
                                        {showFavouritesColumn &&
                                            <TableHeaderColumn style={styles.favouriteTableRowColumn}>
                                                <FavouriteButton
                                                    handlers={this.props.optionContainerHandlers} 
                                                    option="all"
                                                />
                                            </TableHeaderColumn>
                                        }
                                        {defaultFields.map(function(field) {
                                            return (
                                                <SortableTableHeaderColumn
                                                    sortField={this.props.optionsSort.field}
                                                    sortDirection={this.props.optionsSort.direction}
                                                    field={field.name}
                                                    fieldType={field.type}
                                                    key={field.name}
                                                    label={field.label}
                                                    sortHandler={this.props.optionContainerHandlers.sort}
                                                />
                                            );
                                        }, this)}

                                        {sortableExtraFields.map(function(fieldIndex) {
                                            var fieldType = this.props.choice.extra_fields[fieldIndex].type;
                                            if(fieldType === 'list') {
                                                fieldType = this.props.choice.extra_fields[fieldIndex].extra['list_type'];
                                            }
                                        
                                            return (
                                                <SortableTableHeaderColumn
                                                    sortField={this.props.optionsSort.field}
                                                    sortDirection={this.props.optionsSort.direction}
                                                    field={this.props.choice.extra_fields[fieldIndex].name}
                                                    fieldType={fieldType}
                                                    key={this.props.choice.extra_fields[fieldIndex].name}
                                                    label={this.props.choice.extra_fields[fieldIndex].label}
                                                    sortHandler={this.props.optionContainerHandlers.sort}
                                                />
                                            );
                                        }, this)}
                                        {showPublishedColumn &&
                                            <TableHeaderColumn style={styles.publishedTableRowColumn}>Published</TableHeaderColumn>
                                        }
                                        {showApprovedColumn &&
                                            <TableHeaderColumn style={styles.publishedTableRowColumn}>Approved</TableHeaderColumn>
                                        }
                                        {showExpandColumn && 
                                            <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                        }
                                        {showActionsColumn && 
                                            <TableHeaderColumn style={actionsColStyles}></TableHeaderColumn>
                                        }
                                    </TableRow>
                                </TableHeader>
                                <TableBody 
                                    displayRowCheckbox={enableSelection}
                                    deselectOnClickaway={false}
                                >
                                    {this.props.options.options.map(function(option) {
                                        return (
                                            <TableRow 
                                                key={option.id} 
                                                selected={enableSelection && this.props.optionsSelectedTableOrder.indexOf(option.id) !== -1}
                                            >
                                                {showFavouritesColumn &&
                                                    <UnselectableCell style={styles.favouriteTableRowColumn}>
                                                        <FavouriteButton
                                                            handler={this.props.optionContainerHandlers.favourite} 
                                                            optionId={option.id}
                                                            favourited={this.props.favourites.indexOf(option.id) > -1}
                                                        />
                                                    </UnselectableCell>
                                                }
                                                
                                                {defaultFields.map(function(field) {
                                                    return (
                                                        <TableRowColumn style={field.rowStyle} key={field.name}>{option[field.name]}</TableRowColumn>
                                                    );
                                                })}
                                                
                                                {sortableExtraFields.map(function(fieldIndex) {
                                                    return (
                                                        <TableRowColumn style={styles.tableRowColumn} key={this.props.choice.extra_fields[fieldIndex].label}>
                                                            <ExtraField 
                                                                extra={this.props.choice.extra_fields[fieldIndex].extra}
                                                                label={this.props.choice.extra_fields[fieldIndex].label}
                                                                options={this.props.choice.extra_fields[fieldIndex].options}
                                                                //field={this.props.choice.extra_fields[fieldIndex]}
                                                                type={this.props.choice.extra_fields[fieldIndex].type}
                                                                value={option[this.props.choice.extra_fields[fieldIndex].name]}
                                                            />
                                                        </TableRowColumn>
                                                    );
                                                }, this)}
                                                
                                                {showPublishedColumn &&
                                                    <TableRowColumn style={styles.publishedTableRowColumn}>
                                                        {
                                                            option.published?
                                                                <FontIcon className="material-icons">check</FontIcon>
                                                            :
                                                                <FontIcon className="material-icons">close</FontIcon>
                                                        }
                                                    </TableRowColumn>
                                                }
                                                
                                                {showApprovedColumn && 
                                                    <TableRowColumn style={styles.publishedTableRowColumn}>
                                                        {
                                                            option.approved?
                                                                <FontIcon className="material-icons" title="approved">check</FontIcon>
                                                            :
                                                                (option.approved === null)?
                                                                    option.published?
                                                                        <FontIcon className="material-icons" title="awaiting approval">hourglass_empty</FontIcon>
                                                                    :
                                                                        <FontIcon className="material-icons" title="not published">remove</FontIcon>
                                                                :
                                                                    <FontIcon className="material-icons" title="rejected">close</FontIcon>
                                                        }
                                                    </TableRowColumn>
                                                }
                                                
                                                {showExpandColumn && 
                                                    <UnselectableCell style={styles.actionsTableRowColumn}>
                                                        <ExpandButton
                                                            handleClick={this.props.optionContainerHandlers.viewMore} 
                                                            id={option.id}
                                                            style={styles.actionsButtons}
                                                            tooltip=""
                                                        />
                                                    </UnselectableCell>
                                                }
                                                
                                                {showActionsColumn && 
                                                    <UnselectableCell style={actionsColStyles}>
                                                        {(this.isAdmin() || (this.isEditor() && option.can_edit && this.props.instance.editing.editing_open)) &&
                                                            <span>
                                                                <EditButton
                                                                    handleClick={this.props.optionContainerHandlers.edit} 
                                                                    id={option.id}
                                                                    style={styles.actionsButtons}
                                                                    tooltip=""
                                                                />
                                                                {option.published?
                                                                    <UnpublishButton
                                                                        handleClick={this.handleUnpublish} 
                                                                        id={option.id}
                                                                        style={styles.actionsButtons}
                                                                        tooltip=""
                                                                    />
                                                                :
                                                                    <PublishButton
                                                                        handleClick={this.handlePublish} 
                                                                        id={option.id}
                                                                        style={styles.actionsButtons}
                                                                        tooltip=""
                                                                    />
                                                                }
                                                                {/*option.deleted?
                                                                    <RestoreButton
                                                                        handleClick={this.handleRestore} 
                                                                        id={option.id}
                                                                        style={styles.actionsButtons}
                                                                        tooltip=""
                                                                    />
                                                                :*/}
                                                                <DeleteButton
                                                                    handleClick={this.handleDelete} 
                                                                    id={option.id}
                                                                    style={styles.actionsButtons}
                                                                    tooltip=""
                                                                />
                                                            </span>
                                                        }
                                                        {this.isApprover() &&
                                                            <ApprovalButton
                                                                disabled={!option.published && option.approved === null}
                                                                handleClick={this.props.optionContainerHandlers.approve} 
                                                                id={option.id}
                                                                style={styles.actionsButtons}
                                                                tooltip=""
                                                            />
                                                        }
                                                    </UnselectableCell>
                                                }
                                            </TableRow>
                                        );
                                    }, this)}
                                </TableBody>
                            </Table>
                        }
                    </CardText>
                </Card>
                <WarningDialog 
                    handlers={{
                        close: this.handleWarningDialogClose,
                        submit: this.handleWarningDialogSubmit,
                    }}
                    open={this.state.warningDialogOpen}
                />
            </div>
        );
    }
});

module.exports = FieldsWrapper(OptionsTable);