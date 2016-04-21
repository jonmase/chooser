var React = require('react');
var Card  = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardText  = require('material-ui/lib/card/card-text');
var Table = require('material-ui/lib/table/table');
var TableHeaderColumn = require('material-ui/lib/table/table-header-column');
var TableRow = require('material-ui/lib/table/table-row');
var TableHeader = require('material-ui/lib/table/table-header');
var TableRowColumn = require('material-ui/lib/table/table-row-column');
var TableBody = require('material-ui/lib/table/table-body');
var IconButton = require('material-ui/lib/icon-button');
var UsersRole = require('./users-role.jsx');
var SortUsers = require('./sort-users.jsx');
var FilterUsers = require('./filter-users.jsx');
var AddUser = require('./add-user.jsx');
var EditUser = require('./edit-user.jsx');
var EditUserDialog = require('./edit-user-dialog.jsx');
var EditSelectedUsers = require('./edit-selected-users.jsx');
var UsersActionMenu = require('./users-action-menu.jsx');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

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
    }
};
    
var UsersTable = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },
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
                        title="User Roles"
                        subtitle="Give additional roles to specific users"
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
                                roleOptions={props.roleOptions} 
                                handlers={props.filterUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />&nbsp;
                            <EditSelectedUsers
                                state={props.state} 
                                roleOptions={props.roleOptions} 
                                handlers={props.editUserHandlers} 
                            />&nbsp;
                            <AddUser 
                                state={props.state} 
                                roleOptions={props.roleOptions} 
                                handlers={props.addUserHandlers} 
                            />
                            {/*<UsersActionMenu
                            
                            />*/}
                        </div>
                    </CardHeader>
                    <CardText 
                        //expandable={true}
                        style={{paddingTop: '0'}}
                    >
                        <Table 
                            //selectable={false}
                            multiSelectable={true}
                            //onRowSelection={props.selectUserHandlers.change}
                            onRowSelection={this._onRowSelection}
                            //allRowsSelected={props.state.selectAllSelected}
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
                                                        <UsersRole key={user.username + '_' + role} user={user} role={role} />
                                                    );
                                                })}
                                            </TableRowColumn>
                                            <TableRowColumn style={styles.actionsTableRowColumn}>
                                                {!user.current?
                                                    <EditUser
                                                        handlers={props.editUserHandlers} 
                                                        user={user}
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
                    roleOptions={props.roleOptions} 
                    handlers={props.editUserHandlers} 
                />
            </div>
        );
    }
});

module.exports = UsersTable;