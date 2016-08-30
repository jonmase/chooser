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

import AddOption from './add-option.jsx';
import EditOption from './edit-option.jsx';
import ExpandOption from './expand-option.jsx';
import FavouriteOption from './favourite-option.jsx';
import OptionEditDialog from './option-edit-dialog.jsx';
import OptionViewDialog from './option-view-dialog.jsx';

var styles = {
    tableRowColumn: {
        whiteSpace: 'normal',
    },
    actionsTableRowColumn: {
        whiteSpace: 'normal',
        width: '96px',
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
    
var UsersTable = React.createClass({
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
    handleDialogOpen: function(option) {
        this.setState({
            optionBeingViewed: option,
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
        
        switch(props.action) {
            case 'edit':
                var title = 'Options';
                var subtitle = 'Create, edit and manage options';
                break;
            case 'view':
                var title = 'Choose Options';
                var subtitle = false;
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
                                <AddOption 
                                    state={props.state} 
                                    choice={props.choice}
                                    handlers={props.optionEditHandlers} 
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
                            //selectable={false}
                            multiSelectable={true}
                            onRowSelection={this._onRowSelection}
                            onCellClick={this.onCellClick}
                        >
                            <TableHeader 
                                //adjustForCheckbox={false} 
                                displaySelectAll={true}
                            >
                                <TableRow>
                                    {(props.choice.use_code)?<TableHeaderColumn>Code</TableHeaderColumn>:""}
                                    {(props.choice.use_title)?<TableHeaderColumn>Title</TableHeaderColumn>:""}
                                    {(props.choice.use_min_places)?<TableHeaderColumn>Min. Places</TableHeaderColumn>:""}
                                    {(props.choice.use_max_places)?<TableHeaderColumn>Max. Places</TableHeaderColumn>:""}
                                    {(props.choice.use_points)?<TableHeaderColumn>Points</TableHeaderColumn>:""}
                                    {(props.action === 'edit')?<TableHeaderColumn>Published</TableHeaderColumn>:""}
                                    {/*(props.action === 'approve' || props.action === 'edit')?<TableHeaderColumn>Approved</TableHeaderColumn>:""*/}
                                    {(props.action === 'view')?<TableHeaderColumn style={styles.favouriteTableRowColumn}>
                                        <FavouriteOption
                                            handlers={props.optionHandlers} 
                                            option="all"
                                        />
                                    </TableHeaderColumn>:""}
                                    <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody 
                                //displayRowCheckbox={false}
                                deselectOnClickaway={false}
                            >
                                {props.state.options.map(function(option) {
                                    //var user = props.state.users[userIndex];
                                    
                                    return (
                                        <TableRow 
                                            key={option.id} 
                                            //selected={props.state.optionssSelected.indexOf(user.username) !== -1}
                                        >
                                            {(props.choice.use_code)?<TableRowColumn style={styles.tableRowColumn}>{option.code}</TableRowColumn>:""}
                                            {(props.choice.use_title)?<TableRowColumn style={styles.tableRowColumn}>{option.title}</TableRowColumn>:""}
                                            {(props.choice.use_min_places)?<TableRowColumn style={styles.tableRowColumn}>{option.min_places}</TableRowColumn>:""}
                                            {(props.choice.use_max_places)?<TableRowColumn style={styles.tableRowColumn}>{option.max_places}</TableRowColumn>:""}
                                            {(props.choice.use_points)?<TableRowColumn style={styles.tableRowColumn}>{option.points}</TableRowColumn>:""}
                                            {(props.action === 'edit')?<TableRowColumn style={styles.tableRowColumn}>{option.published?"Yes":""}</TableRowColumn>:""}
                                            {/*(props.action === 'approve' || props.action === 'edit')?<TableRowColumn style={styles.tableRowColumn}>{option.approved?"Yes":""}</TableRowColumn>:""*/}
                                            {(props.action === 'view')?<TableRowColumn style={styles.favouriteTableRowColumn}>
                                                <FavouriteOption
                                                    handlers={props.optionHandlers} 
                                                    option={option}
                                                />
                                            </TableRowColumn>:""}
                                            <TableRowColumn style={styles.actionsTableRowColumn}>
                                                {props.action === 'edit'? 
                                                    <EditOption
                                                        handlers={props.optionEditHandlers} 
                                                        option={option}
                                                    />
                                                :""}
                                                {/*props.action === 'view'? 
                                                    <FavouriteOption
                                                        handlers={props.optionHandlers} 
                                                        option={option}
                                                    />
                                                :""*/}
                                                <ExpandOption
                                                    handlers={optionViewHandlers} 
                                                    option={option}
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

module.exports = UsersTable;