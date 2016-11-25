import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

import ExtraField from './extra-field.jsx';
import AddButton from '../elements/buttons/add-button.jsx';
import AddButtonRaised from '../elements/buttons/add-button-raised.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';
import ExpandButton from '../elements/buttons/expand-button.jsx';
import SortableTableHeaderColumn from '../elements/table/sortable-header.jsx';
import UnselectableCell from '../elements/table/unselectable-cell.jsx';
import FavouriteOption from './option-favourite-button.jsx';
import OptionEditDialog from './option-edit-dialog.jsx';
import OptionViewDialog from './option-view-dialog.jsx';

//TODO: Sort out title styles, and keep these styles DRY
var styles = {
    tableRowColumn: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    tableRowColumnTitle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: '30%',
    },
    actionsTableRowColumn: {
        paddingLeft: '12px',
        paddingRight: 0,
        textAlign: 'right',
        whiteSpace: 'normal',
        width: '48px',
    },
    favouriteTableRowColumn: {
        paddingLeft: '12px',
        paddingRight: '12px',
        whiteSpace: 'normal',
        width: '48px',
    },
    sortFilterTitles: {
        display: 'inline-block', 
        fontWeight: '500',
        verticalAlign: '30%', 
        width: '120px',
    },
    cardText: {
        paddingTop: '0px',
    }
};
    
var OptionsTable = React.createClass({
    getInitialState: function () {
        var initialState = {
            optionBeingViewed: null,
            optionDialogOpen: false,
        };
        
        return initialState;
    },
    _onRowSelection: function(selectedRows){
        this.props.optionContainerHandlers.selectOption(selectedRows);
    },
    handleDialogOpen: function(optionId) {
        this.setState({
            optionBeingViewed: optionId,
            optionDialogOpen: true,    //Open the dialog
        });
        return false;
    },
    
    handleDialogClose: function() {
        this.setState({
            optionBeingViewed: null,    //Clear the option being viewed
            optionDialogOpen: false,    //Close the dialog
        });
        return false;
    },
    
    handleExpandMore: function(option) {
        console.log(option);
    },
    handleExpandLess: function(option) {
        console.log(option);
    },
    render: function() {
        /*if(this.props.action === 'view') {
            styles.actionsTableRowColumn.width = '48px';
        }
        else {
            styles.actionsTableRowColumn.width = '96px';
        }*/
        
        var enableSelection = true;
        switch(this.props.action) {
            case 'edit':
                var title = 'Options';
                var subtitle = 'Create, edit and manage options';
                break;
            case 'view':
                var title = 'Choose Options';
                //var subtitle = 'Choose options using the tick boxes. Shortlist them using the stars. Sort the options using the table headings. Review and submit your choices using the basket in the top right. ';
                var subtitle = 'Choose options using the tick boxes';
                enableSelection = this.props.instance.instance.id?true:false;
                break;
            default:
                var title = false;
                var subtitle = false;
                break;
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
        
        var optionTableHandlers = {
            dialogOpen: this.handleDialogOpen,
            dialogClose: this.handleDialogClose,
            expandMore: this.handleExpandMore,
            expandLess: this.handleExpandLess,
        }
        
        var sortableExtraFields = [];
        var filterableExtraFields = [];
        
        this.props.choice.extra_fields.forEach(function(field, index) {
            if(field.sortable) {
                sortableExtraFields.push(index);
            }
            if(field.filterable) {
                filterableExtraFields.push(index);
            }
        });
        
        var content = 
            <div>
                {(this.props.options.options.length == 0)?
                    (this.props.action === 'edit')?
                        <div>
                            <p>You have not created any options yet.</p>
                            <AddButtonRaised 
                                handleAdd={this.props.optionContainerHandlers.dialogOpen} 
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
                                    <FavouriteOption
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
                                    <TableHeaderColumn style={styles.tableHeaderColumn}>Published</TableHeaderColumn>
                                :""}
                                {/*(this.props.action === 'approve' || this.props.action === 'edit')?<TableHeaderColumn style={styles.tableHeaderColumn}>Approved</TableHeaderColumn>:""*/}
                                {this.props.action === 'edit'? 
                                    <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                :""}
                                {/*<TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>*/}
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
                                                <FavouriteOption
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
                                            <TableRowColumn style={styles.tableRowColumn}>{option.published?"Yes":""}</TableRowColumn>
                                        :""}
                                        
                                        {this.props.action === 'edit'? 
                                            <UnselectableCell style={styles.actionsTableRowColumn}>
                                                <EditButton
                                                    handleEdit={this.props.optionContainerHandlers.dialogOpen} 
                                                    id={option.id}
                                                    tooltip=""
                                                />
                                            </UnselectableCell>
                                        :""}
                                        {/*<UnselectableCell style={styles.actionsTableRowColumn}>
                                            <ExpandButton
                                                handleMore={optionTableHandlers.dialogOpen} 
                                                id={option.id}
                                                tooltip=""
                                            />
                                        </UnselectableCell>
                                        */}
                                    </TableRow>
                                );
                            }, this)}
                        </TableBody>
                    </Table>
                }
            </div>;
        
        return (
            <div>
                {/*this.props.action === 'edit'? */}
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
                                {/*
                                <FilterUsers
                                    //roleOptions={this.props.roleOptions} 
                                    //handlers={this.props.filterUsersHandlers} 
                                    //titleStyle={styles.sortFilterTitles}
                                />&nbsp;*/}
                                {(this.props.action === 'edit')&&
                                    <AddButton 
                                        handleAdd={this.props.optionContainerHandlers.dialogOpen} 
                                        tooltip="Add Option"
                                    />
                                }
                            </div>
                        </CardHeader>
                        <CardText 
                            //expandable={true}
                            style={styles.cardText}
                        >
                            {content}
                        </CardText>
                    </Card>
                {/*:
                //    <div>{content}</div>
                /*/}
                <OptionViewDialog
                    choice={this.props.choice}
                    dialogOpen={this.state.optionDialogOpen}
                    handlers={optionTableHandlers}
                    optionBeingViewed={this.state.optionBeingViewed}
                    options={this.props.options}
                />
                {(this.props.action === 'edit')?
                    <OptionEditDialog
                        choice={this.props.choice}
                        handlers={this.props.optionContainerHandlers}
                        optionEditing={this.props.optionEditing} 
                        options={this.props.options}
                        optionSaveButton={this.props.optionSaveButton}
                    />
                :""}
            </div>
        );
    }
});

module.exports = OptionsTable;