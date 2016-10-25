import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';

import ExtraField from './extra-field.jsx';
import AddButton from '../elements/buttons/add-button.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';
import ExpandButton from '../elements/buttons/expand-button.jsx';
import SortableTableHeaderColumn from '../elements/table/sortable-header.jsx';
import UnselectableCell from '../elements/table/unselectable-cell.jsx';
import FavouriteOption from './option-favourite-button.jsx';
import OptionEditDialog from './option-edit-dialog.jsx';
import OptionViewDialog from './option-view-dialog.jsx';

import Loader from '../elements/loader.jsx';

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
        width: '30%',
    },
    actionsTableRowColumn: {
        whiteSpace: 'normal',
        paddingLeft: '12px',
        paddingRight: 0,
        textAlign: 'right',
    },
    favouriteTableRowColumn: {
        whiteSpace: 'normal',
        width: '48px',
        paddingLeft: '12px',
        paddingRight: '12px',
    },
    sortFilterTitles: {
        verticalAlign: '30%', 
        display: 'inline-block', 
        fontWeight: '500',
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
        var props = this.props;
        
        if(props.action === 'view') {
            styles.actionsTableRowColumn.width = '48px';
        }
        else {
            styles.actionsTableRowColumn.width = '96px';
        }
        
        var enableSelection = true;
        switch(props.action) {
            case 'edit':
                var title = 'Options';
                var subtitle = 'Create, edit and manage options';
                break;
            case 'view':
                var title = 'Choose Options';
                var subtitle = false;
                enableSelection = this.props.containerState.instance.id?true:false;
                break;
            default:
                var title = false;
                var subtitle = false;
                break;
        }
        
        var defaultFields = [];
        if(props.choice.use_code) {
            defaultFields.push({
                name: 'code',
                label: 'Code',
                type: 'text',
                rowStyle: styles.tableRowColumn,
            })
        }
        if(props.choice.use_title) {
            defaultFields.push({
                name: 'title',
                label: 'Title',
                type: 'text',
                rowStyle: styles.tableRowColumnTitle,
            })
        }
        if(props.choice.use_min_places) {
            defaultFields.push({
                name: 'min_places',
                label: 'Min. Places',
                type: 'number',
                rowStyle: styles.tableRowColumn,
            })
        }
        if(props.choice.use_max_places) {
            defaultFields.push({
                name: 'max_places',
                label: 'Max. Places',
                type: 'number',
                rowStyle: styles.tableRowColumn,
            })
        }
        if(props.choice.use_points) {
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
        
        props.choice.extra_fields.forEach(function(field, index) {
            if(field.sortable) {
                sortableExtraFields.push(index);
            }
            if(field.filterable) {
                filterableExtraFields.push(index);
            }
        });

        //console.log(props.containerState.optionsSelected);
        
        return (
            <div>
                <Card 
                    className="page-card"
                    //initiallyExpanded={true}
                >
                    <CardHeader
                        title={title}
                        subtitle={subtitle}
                        //actAsExpander={true}
                        //showExpandableButton={true}
                    >
                        <div style={{float: 'right'}}>
                            {/*
                            <FilterUsers
                                state={props.containerState} 
                                roleOptions={props.roleOptions} 
                                handlers={props.filterUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />&nbsp;*/}
                            {props.action === 'edit'? 
                                <AddButton 
                                    handleAdd={props.optionContainerHandlers.dialogOpen} 
                                    tooltip="Add Options"
                                />
                            :""}
                        </div>
                    </CardHeader>
                    <CardText 
                        //expandable={true}
                        style={styles.cardText}
                    >
                        {(!this.props.containerState.optionsLoaded)?
                            <Loader />
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
                                        {(props.action === 'view' && enableSelection)?<TableHeaderColumn style={styles.favouriteTableRowColumn}>
                                            <FavouriteOption
                                                handlers={props.optionContainerHandlers} 
                                                option="all"
                                            />
                                        </TableHeaderColumn>:""}
                                        {defaultFields.map(function(field) {
                                            return (
                                                <SortableTableHeaderColumn
                                                    sortField={props.containerState.sortField}
                                                    sortDirection={props.containerState.sortDirection}
                                                    field={field.name}
                                                    fieldType={field.type}
                                                    key={field.name}
                                                    label={field.label}
                                                    sortHandler={props.optionContainerHandlers.sort}
                                                />
                                            );
                                        })}

                                        {sortableExtraFields.map(function(fieldIndex) {
                                            var fieldType = props.choice.extra_fields[fieldIndex].type;
                                            if(fieldType === 'list') {
                                                fieldType = props.choice.extra_fields[fieldIndex].extra['list_type'];
                                            }
                                        
                                            return (
                                                <SortableTableHeaderColumn
                                                    sortField={props.containerState.sortField}
                                                    sortDirection={props.containerState.sortDirection}
                                                    field={props.choice.extra_fields[fieldIndex].name}
                                                    fieldType={fieldType}
                                                    key={props.choice.extra_fields[fieldIndex].name}
                                                    label={props.choice.extra_fields[fieldIndex].label}
                                                    sortHandler={props.optionContainerHandlers.sort}
                                                />
                                            );
                                        })}
                                        {(props.action === 'edit')?
                                            <TableHeaderColumn style={styles.tableHeaderColumn}>Published</TableHeaderColumn>
                                        :""}
                                        {/*(props.action === 'approve' || props.action === 'edit')?<TableHeaderColumn style={styles.tableHeaderColumn}>Approved</TableHeaderColumn>:""*/}
                                        {props.action === 'edit'? 
                                            <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                        :""}
                                        <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody 
                                    displayRowCheckbox={enableSelection}
                                    deselectOnClickaway={false}
                                >
                                    {props.containerState.options.map(function(option) {
                                        //var user = props.containerState.users[userIndex];
                                        //console.log(option.id + ": " + props.containerState.optionsSelected.indexOf(option.id));
                                        return (
                                            <TableRow 
                                                key={option.id} 
                                                selected={props.containerState.optionsSelected.indexOf(option.id) !== -1}
                                            >
                                                {(props.action === 'view' && enableSelection)?
                                                    <UnselectableCell style={styles.favouriteTableRowColumn}>
                                                        <FavouriteOption
                                                            handler={props.optionContainerHandlers.favourite} 
                                                            optionId={option.id}
                                                            favourited={props.containerState.favourites.indexOf(option.id) > -1}
                                                        />
                                                    </UnselectableCell>
                                                :""}
                                                
                                                {defaultFields.map(function(field) {
                                                    return (
                                                        <TableRowColumn style={field.rowStyle} key={field.name}>{option[field.name]}</TableRowColumn>
                                                    );
                                                })}
                                                
                                                {sortableExtraFields.map(function(fieldIndex) {
                                                    return (
                                                        <TableRowColumn style={styles.tableRowColumn} key={props.choice.extra_fields[fieldIndex].label}>
                                                            <ExtraField 
                                                                extra={props.choice.extra_fields[fieldIndex].extra}
                                                                label={props.choice.extra_fields[fieldIndex].label}
                                                                options={props.choice.extra_fields[fieldIndex].options}
                                                                //field={props.choice.extra_fields[fieldIndex]}
                                                                type={props.choice.extra_fields[fieldIndex].type}
                                                                value={option[props.choice.extra_fields[fieldIndex].name]}
                                                            />
                                                        </TableRowColumn>
                                                    );
                                                })}
                                                
                                                {(props.action === 'edit')?
                                                    <TableRowColumn style={styles.tableRowColumn}>{option.published?"Yes":""}</TableRowColumn>
                                                :""}
                                                
                                                {props.action === 'edit'? 
                                                    <UnselectableCell style={styles.actionsTableRowColumn}>
                                                        <EditButton
                                                            handleEdit={props.optionContainerHandlers.dialogOpen} 
                                                            id={option.id}
                                                            tooltip=""
                                                        />
                                                    </UnselectableCell>
                                                :""}
                                                <UnselectableCell style={styles.actionsTableRowColumn}>
                                                    <ExpandButton
                                                        handleMore={optionTableHandlers.dialogOpen} 
                                                        id={option.id}
                                                        tooltip=""
                                                    />
                                                </UnselectableCell>
                                            </TableRow>
                                        );
                                    }, this)}
                                </TableBody>
                            </Table>
                        }
                    </CardText>
                </Card>
                    <OptionViewDialog
                        choice={props.choice}
                        handlers={optionTableHandlers}
                        containerState={props.containerState} 
                        viewState={this.state}
                    />
                    {(props.action === 'edit')?
                        <OptionEditDialog
                            choice={props.choice}
                            handlers={props.optionContainerHandlers}
                            containerState={props.containerState} 
                        />
                    :""}
            </div>
        );
    }
});

module.exports = OptionsTable;