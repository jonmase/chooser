var React = require('react');
var Table = require('material-ui/lib/table/table');
var TableHeaderColumn = require('material-ui/lib/table/table-header-column');
var TableRow = require('material-ui/lib/table/table-row');
var TableHeader = require('material-ui/lib/table/table-header');
var TableRowColumn = require('material-ui/lib/table/table-row-column');
var TableBody = require('material-ui/lib/table/table-body');
var FontIcon = require('material-ui/lib/font-icon');
var IconButton = require('material-ui/lib/icon-button');
var FlatButton  = require('material-ui/lib/flat-button');

var styles = {
    TableRowColumn: {
        whiteSpace: 'normal',
    },
    roleContainer: {
        whiteSpace: 'normal',
        display: 'inline-block',
    },
    roleText: {
        lineHeight: '48px',
        fontSize: '14px',
        verticalAlign: '-2px',
    },
    roleRemoveButton: {
        marginLeft: '-10px',
    },
    roleRemoveIcon: {
        //fontSize: '20px',
    },
};
    
var UsersTable = React.createClass({
    getUsers: function() {
        var users = this.props.users;
        return users;
    },
    
    render: function() {
        return (
            <Table selectable={false}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn>Username</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Email</TableHeaderColumn>
                        <TableHeaderColumn>Roles</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {this.getUsers().map(function(user) {
                        return (
                            <TableRow key={user.username}>
                                <TableRowColumn style={styles.TableRowColumn}>{user.username}</TableRowColumn>
                                <TableRowColumn style={styles.TableRowColumn}>{user.fullname}</TableRowColumn>
                                <TableRowColumn style={styles.TableRowColumn}>{user.email}</TableRowColumn>
                                <TableRowColumn style={styles.TableRowColumn}>
                                    {user.roles.map(function(role) {
                                        /*return (
                                            <FlatButton
                                                key={user.username + '_' + role}
                                                label={role}
                                                labelPosition="before"
                                                linkButton={true}
                                                href="javascript:void(0)"
                                                //secondary={true}
                                                icon={<FontIcon className="material-icons" >close</FontIcon>}
                                            />
                                        );*/
                                        return (
                                            <span key={user.username + '_' + role} style={styles.roleContainer}>
                                                <span style={styles.roleText}>
                                                    {role.toUpperCase()}
                                                </span>
                                                <IconButton 
                                                    style={styles.roleRemoveButton} 
                                                    iconStyle={styles.roleRemoveIcon} 
                                                    linkButton={true} 
                                                    href="javascript:void(0)"
                                                >
                                                    <FontIcon className="material-icons">
                                                        close
                                                    </FontIcon>
                                                </IconButton>
                                            </span>
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