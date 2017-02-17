import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

import UsersRole from './user-role.jsx';
import SortUsers from './user-sort.jsx';
import FilterUsers from './user-filter.jsx';
import UsersActionMenu from './user-action-menu.jsx';

import AddButton from '../elements/buttons/add-button.jsx';
import EditButton from '../elements/buttons/edit-button.jsx'; 
import SortableTableHeaderColumn from '../elements/table/sortable-header.jsx';


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
        this.props.selectUserHandlers.change(selectedRows);
    },
    render: function() {
        var props = this.props;
        var filterRoles = props.filterRoles;
        
        var sortableColumns = [
            {
                field: "username",
                label: "Username",
            },
            {
                field: "lastname",
                label: "Name",
            },
            {
                field: "email",
                label: "Email",
            },
        ]
        
        return (
            <div>
                <Card 
                    className="page-card"
                    //initiallyExpanded={true}
                >
                    <CardHeader
                        title="Additional Permissions"
                        subtitle="Give additional permissions to specific users"
                        //actAsExpander={true}
                        //showExpandableButton={true}
                    >
                        <div style={{float: 'right'}}>
                            <FilterUsers
                                state={props.state} 
                                roles={props.roles} 
                                handler={props.filterHandler} 
                                titleStyle={styles.sortFilterTitles}
                            />&nbsp;
                            <EditButton
                                disabled={this.props.usersSelected.length===0?true:false}
                                handleEdit={this.props.setButtonClickHandler}
                                id={this.props.usersSelected}
                                tooltip={this.props.usersSelected.length===0?"":"Edit Selected Users"}
                            />&nbsp;
                            <AddButton
                                handleAdd={this.props.setButtonClickHandler}
                                tooltip="Set Permissions"
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
                                    {sortableColumns.map(function(field) {
                                        return (
                                            <SortableTableHeaderColumn
                                                sortField={this.props.sort.field}
                                                sortDirection={this.props.sort.direction}
                                                field={field.field}
                                                fieldType="text"
                                                key={field.field}
                                                label={field.label}
                                                sortHandler={this.props.sortHandler}
                                            />
                                        );
                                    }, this)}
                                    <TableHeaderColumn>Roles</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody 
                                //displayRowCheckbox={false}
                                deselectOnClickaway={false}
                            >
                                {props.filteredUserIndexes.map(function(userIndex, index) {
                                    var user = props.users[userIndex];
                                    return (
                                        <TableRow 
                                            key={user.username} 
                                            className={user.current?"self":""}
                                            selectable={!user.current}
                                            selected={props.usersSelected.indexOf(index) !== -1}
                                        >
                                            <TableRowColumn style={styles.tableRowColumn}>{user.username}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{user.fullname}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{user.email}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>
                                                {user.roles.map(function(role) {
                                                    return (
                                                        <UsersRole key={user.username + '_' + role} user={user} role={role} />
                                                    );
                                                })}
                                            </TableRowColumn>
                                            <TableRowColumn style={styles.actionsTableRowColumn}>
                                                {!user.current?
                                                    <EditButton
                                                        handleEdit={props.setButtonClickHandler} 
                                                        id={[index]}
                                                        tooltip=""
                                                    />
                                                :""}
                                            </TableRowColumn>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardText>
                </Card>
            </div>
        );
    }
});

module.exports = UsersTable;