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
import FavouriteOption from './option-favourite-button.jsx';
import OptionEditDialog from './option-edit-dialog.jsx';
import OptionViewDialog from './option-view-dialog.jsx';

//TODO: Sort out title styles, and keep these styles DRY
var styles = {
    tableHeaderColumn: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    tableHeaderColumnTitle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '30%',
    },
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
        paddingRight: '12px',
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
    onCellClick: function(rowNumber, columnId, event){
        //Trying to stop the row from being selected when certain cells are clicked (.e.g actions)
        //console.log(rowNumber, columnId, event);
        //event.stopPropagation();
        //console.log(event.pageX);
        //if(columnId === 6) {
            return false;
        //}
    },
    _onRowSelection: function(selectedRows){
        //console.log(selectedRows);
        //this.props.selectUserHandlers.change(selectedRows);
    },
    _onSelectAll: function(selectedRows){
        //this.props.selectUserHandlers.change(selectedRows);
    },
    handleDialogOpen: function(optionId) {
        this.setState({
            optionBeingViewed: optionId,
            optionDialogOpen: true,    //Open the dialog
        });
    },
    
    handleDialogClose: function() {
        this.setState({
            optionBeingViewed: null,    //Clear the option being viewed
            optionDialogOpen: false,    //Close the dialog
        });
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
                enableSelection = this.props.instance.id?true:false;
                break;
            default:
                var title = false;
                var subtitle = false;
                break;
        }
        
        var optionViewHandlers = {
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
                            {/*<SortUsers 
                                state={props.state}
                                handlers={props.sortUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />&nbsp;
                            <FilterUsers
                                state={props.state} 
                                roleOptions={props.roleOptions} 
                                handlers={props.filterUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />&nbsp;*/}
                            {props.action === 'edit'? 
                                <AddButton 
                                    handleAdd={props.optionEditHandlers.dialogOpen} 
                                    tooltip="Add Options"
                                />
                            :""}
                            
                            {/*<UsersActionMenu
                            
                            />*/}
                        </div>
                    </CardHeader>
                    <CardText 
                        //expandable={true}
                        style={styles.cardText}
                    >
                        <Table 
                            selectable={enableSelection}
                            multiSelectable={true}
                            onRowSelection={this._onRowSelection}
                            onCellClick={this.onCellClick}
                        >
                            <TableHeader 
                                adjustForCheckbox={enableSelection} 
                                displaySelectAll={enableSelection}
                            >
                                <TableRow>
                                    {(props.action === 'view' && enableSelection)?<TableHeaderColumn style={styles.favouriteTableRowColumn}>
                                        <FavouriteOption
                                            handlers={props.optionHandlers} 
                                            option="all"
                                        />
                                    </TableHeaderColumn>:""}
                                    {(props.choice.use_code)?<TableHeaderColumn style={styles.tableHeaderColumn}>Code</TableHeaderColumn>:""}
                                    {(props.choice.use_title)?<TableHeaderColumn style={styles.tableHeaderColumnTitle}>Title</TableHeaderColumn>:""}
                                    {(props.choice.use_min_places)?<TableHeaderColumn style={styles.tableHeaderColumn}>Min. Places</TableHeaderColumn>:""}
                                    {(props.choice.use_max_places)?<TableHeaderColumn style={styles.tableHeaderColumn}>Max. Places</TableHeaderColumn>:""}
                                    {(props.choice.use_points)?<TableHeaderColumn style={styles.tableHeaderColumn}>Points</TableHeaderColumn>:""}
                                    {sortableExtraFields.map(function(fieldIndex) {
                                        return (
                                            <TableHeaderColumn style={styles.tableHeaderColumn} key={props.choice.extra_fields[fieldIndex].name}>{props.choice.extra_fields[fieldIndex].label}</TableHeaderColumn>
                                        );
                                    })}
                                    {(props.action === 'edit')?<TableHeaderColumn style={styles.tableHeaderColumn}>Published</TableHeaderColumn>:""}
                                    {/*(props.action === 'approve' || props.action === 'edit')?<TableHeaderColumn style={styles.tableHeaderColumn}>Approved</TableHeaderColumn>:""*/}
                                    <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody 
                                displayRowCheckbox={enableSelection}
                                deselectOnClickaway={false}
                            >
                                {props.state.options.map(function(option) {
                                    //var user = props.state.users[userIndex];
                                    
                                    return (
                                        <TableRow 
                                            key={option.id} 
                                            //selected={props.state.optionssSelected.indexOf(user.username) !== -1}
                                        >
                                             {(props.action === 'view' && enableSelection)?<TableRowColumn style={styles.favouriteTableRowColumn}>
                                                <FavouriteOption
                                                    handlers={props.optionHandlers} 
                                                    option={option}
                                                />
                                            </TableRowColumn>:""}
                                            {(props.choice.use_code)?<TableRowColumn style={styles.tableRowColumn}>{option.code}</TableRowColumn>:""}
                                            {(props.choice.use_title)?<TableRowColumn style={styles.tableRowColumnTitle}>{option.title}</TableRowColumn>:""}
                                            {(props.choice.use_min_places)?<TableRowColumn style={styles.tableRowColumn}>{option.min_places}</TableRowColumn>:""}
                                            {(props.choice.use_max_places)?<TableRowColumn style={styles.tableRowColumn}>{option.max_places}</TableRowColumn>:""}
                                            {(props.choice.use_points)?<TableRowColumn style={styles.tableRowColumn}>{option.points}</TableRowColumn>:""}
                                            {sortableExtraFields.map(function(fieldIndex) {
                                                return (
                                                    <TableRowColumn style={styles.tableRowColumn} key={props.choice.extra_fields[fieldIndex].label}>
                                                        <ExtraField 
                                                            field={props.choice.extra_fields[fieldIndex]}
                                                            value={option[props.choice.extra_fields[fieldIndex].name]}
                                                        />
                                                    </TableRowColumn>
                                                );
                                                
                                                /*var content = option[props.choice.extra_fields[fieldIndex].name];
                                                if(typeof(content) === 'string') {
                                                    return (
                                                        <TableRowColumn style={styles.tableRowColumn} key={props.choice.extra_fields[fieldIndex].label}>{content}</TableRowColumn>
                                                    );
                                                }
                                                else {
                                                    return (
                                                        <TableRowColumn style={styles.tableRowColumn} key={props.choice.extra_fields[fieldIndex].label}>-</TableRowColumn>
                                                    );
                                                }*/
                                            })}
                                            {(props.action === 'edit')?<TableRowColumn style={styles.tableRowColumn}>{option.published?"Yes":""}</TableRowColumn>:""}
                                            <TableRowColumn style={styles.actionsTableRowColumn}>
                                                {props.action === 'edit'? 
                                                    <EditButton
                                                        handleEdit={props.optionEditHandlers.dialogOpen} 
                                                        id={option.id}
                                                        tooltip=""
                                                    />
                                                :""}
                                                <ExpandButton
                                                    handleMore={optionViewHandlers.dialogOpen} 
                                                    id={option.id}
                                                    tooltip=""
                                                />
                                            </TableRowColumn>

                                        </TableRow>
                                    );
                                }, this)}
                            </TableBody>
                        </Table>
                    </CardText>
                </Card>
                <OptionViewDialog
                    choice={props.choice}
                    handlers={optionViewHandlers}
                    state={props.state} 
                    viewState={this.state}
                />
                {(props.action === 'edit')?
                    <OptionEditDialog
                        choice={props.choice}
                        handlers={props.optionEditHandlers}
                        state={props.state} 
                    />
                :""}
            </div>
        );
    }
});

module.exports = OptionsTable;