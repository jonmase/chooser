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
var UsersRole = require('./users-role.jsx');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var styles = {
    tableRowColumn: {
        whiteSpace: 'normal',
    },
};
    
var UsersTable = React.createClass({
    //the key passed through context must be called "muiTheme"
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },

    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },

    getUsers: function() {
        var users = this.props.users;
        return users;
    },
    
    render: function() {
        return (
            <Card 
                //initiallyExpanded={true}
            >
                <CardHeader
                    title="User Roles"
                    subtitle="Give specific users additional roles for this Choice"
                    //actAsExpander={true}
                    //showExpandableButton={true}
                />
                <CardText 
                    //expandable={true}
                >
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
                </CardText>
            </Card>
        );
    }
});

module.exports = UsersTable;