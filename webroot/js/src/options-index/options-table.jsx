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


var styles = {
    tableRowColumn: {
        whiteSpace: 'normal',
    },
    actionsTableRowColumn: {
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
    _onRowSelection: function(selectedRows){
        //this.props.selectUserHandlers.change(selectedRows);
    },
    _onSelectAll: function(selectedRows){
        //this.props.selectUserHandlers.change(selectedRows);
    },
    render: function() {
        var props = this.props;

        return (
            <div>
                <Card 
                    className="page-card"
                    //initiallyExpanded={true}
                >
                    <CardHeader
                        title="Options"
                        subtitle="Create, edit and manage options"
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
                            />&nbsp;
                            <EditSelectedUsers
                                state={props.state} 
                                handlers={props.editUserHandlers} 
                            />&nbsp;*/}
                            <AddOption 
                                state={props.state} 
                                choice={props.choice}
                                handlers={props.addHandlers} 
                            />
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
                        >
                            <TableHeader 
                                //adjustForCheckbox={false} 
                                displaySelectAll={false}
                            >
                                <TableRow>
                                    <TableHeaderColumn>Code</TableHeaderColumn>
                                    <TableHeaderColumn>Title</TableHeaderColumn>
                                    <TableHeaderColumn>Min. Places</TableHeaderColumn>
                                    <TableHeaderColumn>Max. Places</TableHeaderColumn>
                                    <TableHeaderColumn>Points</TableHeaderColumn>
                                    <TableHeaderColumn>Published</TableHeaderColumn>
                                    <TableHeaderColumn>Approved</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody 
                                //displayRowCheckbox={false}
                                deselectOnClickaway={false}
                            >
                                {/*props.state.filteredOptions.map(function(option) {
                                    //var user = props.state.users[userIndex];
                                    return (
                                        <TableRow 
                                            key={option.id} 
                                            //selected={props.state.optionssSelected.indexOf(user.username) !== -1}
                                        >
                                            <TableRowColumn style={styles.tableRowColumn}>{option.code}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{option.title}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{option.min_places}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{option.max_places}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{option.points}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{option.published}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{option.approved}</TableRowColumn>
                                            <TableRowColumn style={styles.actionsTableRowColumn}>
                                            </TableRowColumn>
                                        </TableRow>
                                    );
                                })*/}
                            </TableBody>
                        </Table>
                    </CardText>
                </Card>
                {/*<EditUserDialog 
                    state={props.state} 
                    roleOptions={props.roleOptions} 
                    handlers={props.editUserHandlers} 
                />*/}
            </div>
        );
    }
});

module.exports = UsersTable;