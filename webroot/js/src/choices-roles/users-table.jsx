var React = require('react');
var Table = require('material-ui/lib/table/table');
var TableHeaderColumn = require('material-ui/lib/table/table-header-column');
var TableRow = require('material-ui/lib/table/table-row');
var TableHeader = require('material-ui/lib/table/table-header');
var TableRowColumn = require('material-ui/lib/table/table-row-column');
var TableBody = require('material-ui/lib/table/table-body');
var UsersRole = require('./users-role.jsx');
//var FontIcon = require('material-ui/lib/font-icon');
//var IconButton = require('material-ui/lib/icon-button');
//var FlatButton  = require('material-ui/lib/flat-button');

var styles = {
    tableRowColumn: {
        whiteSpace: 'normal',
    },
};
    
var UsersTable = React.createClass({
    getUsers: function() {
        var users = this.props.users;
        return users;
    },
    
    render: function() {
        return (
            <Table 
                //selectable={false}
                multiSelectable={true}
            >
                <TableHeader 
                    //adjustForCheckbox={false} 
                    //displaySelectAll={false}
                >
                    <TableRow>
                        <TableHeaderColumn>Username</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Email</TableHeaderColumn>
                        <TableHeaderColumn>Roles</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody 
                    //displayRowCheckbox={false}
                    deselectOnClickaway={false}
                >
                    {this.getUsers().map(function(user) {
                        return (
                            <TableRow key={user.username}>
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
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
});

module.exports = UsersTable;