import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

import UsersRole from './user-role.jsx';
import SortUsers from './user-sort.jsx';
import FilterUsers from './user-filter.jsx';
import AddUser from './user-add.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';
import EditUserDialog from './user-edit-dialog.jsx';
import EditSelectedUsers from './user-edit-selected.jsx';
import UsersActionMenu from './user-action-menu.jsx';
import AddButton from '../elements/buttons/add-button.jsx';

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
    _onSelectAll: function(selectedRows){
        this.props.selectUserHandlers.change(selectedRows);
    },
    render: function() {
        var props = this.props;
        var filterRoles = this.props.state.filterRoles;
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
                            <SortUsers 
                                state={props.state}
                                handlers={props.sortUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />&nbsp;
                            <FilterUsers
                                state={props.state} 
                                roles={props.roles} 
                                handlers={props.filterUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />&nbsp;
                            <EditSelectedUsers
                                state={props.state} 
                                handlers={props.editUserHandlers} 
                            />&nbsp;
                            <AddButton
                                handleAdd={this.props.addButtonClickHandler}
                                tooltip="Add User"
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
                                    <TableHeaderColumn>Username</TableHeaderColumn>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    <TableHeaderColumn>Email</TableHeaderColumn>
                                    <TableHeaderColumn>Roles</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody 
                                //displayRowCheckbox={false}
                                deselectOnClickaway={false}
                            >
                                {props.state.filteredUserIndexes.map(function(userIndex) {
                                    var user = props.state.users[userIndex];
                                    return (
                                        <TableRow 
                                            key={user.username} 
                                            className={user.current?"self":""}
                                            selectable={!user.current}
                                            selected={props.state.usersSelected.indexOf(user.username) !== -1}
                                        >
                                            <TableRowColumn style={styles.tableRowColumn}>{user.username}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{user.fullname}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>{user.email}</TableRowColumn>
                                            <TableRowColumn style={styles.tableRowColumn}>
                                                {user.roles.map(function(role) {
                                                    return (
                                                        <UsersRole key={user.username + '_' + role.id} user={user} role={role} />
                                                    );
                                                })}
                                            </TableRowColumn>
                                            <TableRowColumn style={styles.actionsTableRowColumn}>
                                                {!user.current?
                                                    <EditButton
                                                        handleEdit={props.editUserHandlers.dialogOpen} 
                                                        id={[user.username]}
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
                <EditUserDialog 
                    state={props.state} 
                    roles={props.roles} 
                    handlers={props.editUserHandlers} 
                />
            </div>
        );
    }
});

module.exports = UsersTable;