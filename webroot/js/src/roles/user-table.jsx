import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {indigo500} from 'material-ui/styles/colors';

import UsersRole from './user-role.jsx';
import SortUsers from './user-sort.jsx';
import FilterUsers from './user-filter.jsx';
import UsersActionMenu from './user-action-menu.jsx';

import AddButton from '../elements/buttons/add-button.jsx';
import EditButton from '../elements/buttons/edit-button.jsx'; 
import DeleteButton from '../elements/buttons/delete-button.jsx'; 
import SortableTableHeaderColumn from '../elements/table/sortable-header.jsx';
import UnselectableCell from '../elements/table/unselectable-cell.jsx';


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
    cardText: {
        paddingTop: '0px',
    }
};
    
var UsersTable = React.createClass({
    _onRowSelection: function(selectedRows){
        this.props.handlers.selectChange(selectedRows);
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
                        textStyle={{paddingRight: '20px'}}
                        //actAsExpander={true}
                        //showExpandableButton={true}
                    >
                        <div style={{float: 'right'}}>
                            <FilterUsers
                                filteredRoles={this.props.filteredRoles}
                                handler={props.handlers.filter} 
                                iconStyle={(this.props.filteredRoles.length > 0) && {color: indigo500}}
                                roles={props.roles} 
                            />&nbsp;
                            <EditButton
                                disabled={this.props.usersSelected.length===0?true:false}
                                handleEdit={this.props.handlers.setButtonClick}
                                id={this.props.usersSelected}
                                tooltip={this.props.usersSelected.length===0?"":"Edit Selected Users"}
                            />&nbsp;
                            <DeleteButton
                                disabled={this.props.usersSelected.length===0?true:false}
                                handleDelete={this.props.handlers.deleteButtonClick}
                                id={this.props.usersSelected}
                                tooltip={this.props.usersSelected.length===0?"":"Remove Selected Users"}
                            />&nbsp;
                            <AddButton
                                handleAdd={this.props.handlers.setButtonClick}
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
                                                sortHandler={this.props.handlers.sort}
                                            />
                                        );
                                    }, this)}
                                    <TableHeaderColumn>Roles</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                    <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody 
                                //displayRowCheckbox={false}
                                deselectOnClickaway={false}
                            >
                                {props.filteredUserIndexes.map(function(userIndex) {
                                    var user = props.users[userIndex];
                                    return (
                                        <TableRow 
                                            key={user.username} 
                                            className={user.current?"self":""}
                                            selectable={!user.current}
                                            selected={props.usersSelected.indexOf(userIndex) !== -1}
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
                                            <UnselectableCell style={styles.actionsTableRowColumn}>
                                                {!user.current?
                                                    <EditButton
                                                        handleEdit={props.handlers.setButtonClick} 
                                                        id={[userIndex]}
                                                        tooltip=""
                                                    />
                                                :""}
                                            </UnselectableCell>
                                            <UnselectableCell style={styles.actionsTableRowColumn}>
                                                {!user.current?
                                                    <DeleteButton
                                                        handleDelete={props.handlers.deleteButtonClick} 
                                                        id={[userIndex]}
                                                        tooltip=""
                                                    />
                                                :""}
                                            </UnselectableCell>
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