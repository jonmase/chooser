import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';

import ExtraField from './extra-field.jsx';

import AddButton from '../elements/buttons/add-button.jsx';
import AddButtonRaised from '../elements/buttons/add-button-raised.jsx';
import DeleteButton from '../elements/buttons/delete-button.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';
import ExpandButton from '../elements/buttons/expand-button.jsx';
import FavouriteButton from './option-favourite-button.jsx';
import PublishButton from '../elements/buttons/publish-button.jsx';
import RestoreButton from '../elements/buttons/restore-button.jsx';
import UnpublishButton from '../elements/buttons/unpublish-button.jsx';

import SortableTableHeaderColumn from '../elements/table/sortable-header.jsx';
import UnselectableCell from '../elements/table/unselectable-cell.jsx';

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
    
var OptionsTable = React.createClass({
    _onRowSelection: function(selectedRows){
        this.props.optionContainerHandlers.selectOption(selectedRows);
    },
    
    handleDelete: function(optionId) {
        this.changeStatus('delete', optionId, true);
    },
    
    handlePublish: function(optionId) {
        this.changeStatus('publish', optionId, true);
    },
    
    handleRestore: function(optionId) {
        this.changeStatus('delete', optionId, false);
    },
    
    handleUnpublish: function(optionId) {
        this.changeStatus('publish', optionId, false);
    },
    
    changeStatus: function(action, optionId, status) {
        console.log(optionId + ': ' + (!status && 'un') + action);
        
        var data = {
            action: action,
            choices_option_id: optionId,
            status: status
        };
        
        //Save the settings
        var url = 'status.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(returnedData) {
                console.log(returnedData.response);
                
                this.props.optionContainerHandlers.handleReturnedData(returnedData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.props.optionContainerHandlers.handleError(err);
            }.bind(this)
        });
    },
    
    render: function() {
        var enableSelection = true;
        switch(this.props.action) {
            case 'edit':
                var title = 'Options';
                var subtitle = 'Create, edit and manage options';
                enableSelection = false;
                break;
            case 'view':
                var title = 'Choose Options';
                //var subtitle = 'Choose options using the tick boxes. Shortlist them using the stars. Sort the options using the table headings. Review and submit your choices using the button in the top right. ';
                var subtitle = 'Choose options using the tick boxes. Sort the options using the table headings. Review and submit your choices using the button in the top right.';
                enableSelection = this.props.instance.instance.id?true:false;
                break;
            default:
                var title = false;
                var subtitle = false;
                break;
        }
        
        var showExpandButton = false;
        if(this.props.choice.use_description) {
            showExpandButton = true;
        }
        
        var defaultFields = [];
        if(this.props.choice.use_code) {
            defaultFields.push({
                name: 'code',
                label: 'Code',
                type: 'text',
                rowStyle: styles.tableRowColumn,
            })
        }
        if(this.props.choice.use_title) {
            defaultFields.push({
                name: 'title',
                label: 'Title',
                type: 'text',
                rowStyle: styles.tableRowColumnTitle,
            })
        }
        if(this.props.choice.use_min_places) {
            defaultFields.push({
                name: 'min_places',
                label: 'Min. Places',
                type: 'number',
                rowStyle: styles.tableRowColumn,
            })
        }
        if(this.props.choice.use_max_places) {
            defaultFields.push({
                name: 'max_places',
                label: 'Max. Places',
                type: 'number',
                rowStyle: styles.tableRowColumn,
            })
        }
        if(this.props.choice.use_points) {
            defaultFields.push({
                name: 'points',
                label: 'Points',
                type: 'number',
                rowStyle: styles.tableRowColumn,
            })
        }
        
        var sortableExtraFields = [];
        var filterableExtraFields = [];
        
        this.props.choice.extra_fields.forEach(function(field, index) {
            //If field is sortable, add it to the array of sortable fields
            if(field.sortable) {
                sortableExtraFields.push(index);
            }
            //Otherwise, field will not be shown, so need to show expand button, if not already doing so
            else if(!showExpandButton) {
                showExpandButton = true;
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
                    <CardHeader
                        title={title}
                        subtitle={subtitle}
                        textStyle={{float: 'left'}}
                        style={{height: '72px'}}
                        //actAsExpander={true}
                        //showExpandableButton={true}
                    >
                        <div style={{float: 'right', marginTop: '-4px'}}>
                            {(this.props.action === 'edit')&&
                                <AddButton 
                                    handleClick={this.props.optionContainerHandlers.edit} 
                                    tooltip="Add Option"
                                />
                            }
                        </div>
                    </CardHeader>
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
                                        {/*(this.props.action === 'view' && enableSelection)?<TableHeaderColumn style={styles.favouriteTableRowColumn}>
                                            <FavouriteButton
                                                handlers={this.props.optionContainerHandlers} 
                                                option="all"
                                            />
                                        </TableHeaderColumn>:""*/}
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
                                        {(this.props.action === 'edit')?
                                            <TableHeaderColumn style={styles.publishedTableRowColumn}>Published</TableHeaderColumn>
                                        :""}
                                        {/*(this.props.action === 'approve' || this.props.action === 'edit')?<TableHeaderColumn style={styles.tableHeaderColumn}>Approved</TableHeaderColumn>:""*/}
                                        {showExpandButton && 
                                            <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                        }
                                        {this.props.action === 'edit'? 
                                            <TableHeaderColumn style={styles.editorActionsTableRowColumn}></TableHeaderColumn>
                                        :""}
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
                                                {/*(this.props.action === 'view' && enableSelection)?
                                                    <UnselectableCell style={styles.favouriteTableRowColumn}>
                                                        <FavouriteButton
                                                            handler={this.props.optionContainerHandlers.favourite} 
                                                            optionId={option.id}
                                                            favourited={this.props.favourites.indexOf(option.id) > -1}
                                                        />
                                                    </UnselectableCell>
                                                :""*/}
                                                
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
                                                
                                                {(this.props.action === 'edit')?
                                                    <TableRowColumn style={styles.publishedTableRowColumn}>
                                                        {
                                                            option.published?
                                                                <FontIcon className="material-icons">check</FontIcon>
                                                            :
                                                                <FontIcon className="material-icons">close</FontIcon>
                                                        }
                                                    </TableRowColumn>
                                                :""}
                                                
                                                {showExpandButton && 
                                                    <UnselectableCell style={styles.actionsTableRowColumn}>
                                                        <ExpandButton
                                                            handleClick={this.props.optionContainerHandlers.viewMore} 
                                                            id={option.id}
                                                            style={styles.actionsButtons}
                                                            tooltip=""
                                                        />
                                                    </UnselectableCell>
                                                }
                                                
                                                {this.props.action === 'edit'? 
                                                    <UnselectableCell style={styles.editorActionsTableRowColumn}>
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
                                                        {option.deleted?
                                                            <RestoreButton
                                                                handleClick={this.handleRestore} 
                                                                id={option.id}
                                                                style={styles.actionsButtons}
                                                                tooltip=""
                                                            />
                                                        :
                                                            <DeleteButton
                                                                handleClick={this.handleDelete} 
                                                                id={option.id}
                                                                style={styles.actionsButtons}
                                                                tooltip=""
                                                            />
                                                        }
                                                    </UnselectableCell>
                                                :""}
                                            </TableRow>
                                        );
                                    }, this)}
                                </TableBody>
                            </Table>
                        }
                    </CardText>
                </Card>
            </div>
        );
    }
});

module.exports = OptionsTable;