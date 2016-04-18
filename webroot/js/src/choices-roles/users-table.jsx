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
var AddUser = require('./add-user.jsx');
var FilterUsers = require('./filter-users.jsx');
var SortUsers = require('./sort-users.jsx');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var styles = {
    tableRowColumn: {
        whiteSpace: 'normal',
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

    render: function() {
        var filterRoles = this.props.state.filterRoles;
        var noRoleFilters = this.props.roleOptions.every(function(role) { return !filterRoles[role]; });
        return (
            <Card 
                className="page-card"
                //initiallyExpanded={true}
            >
                <CardHeader
                    title="User Roles"
                    subtitle="Give additional roles to specific users"
                    //actAsExpander={true}
                    //showExpandableButton={true}
                />
                
                <CardText 
                    //expandable={true}
                    style={{paddingTop: '0'}}
                >
                    <div style={{width: '100%', minHeight: '60px', marginBottom: '20px'}}>
                        <div style={{float: 'right'}}>
                            <AddUser 
                                state={this.props.state} 
                                roleOptions={this.props.roleOptions} 
                                handlers={this.props.addUserHandlers} 
                            />
                        </div>
                        <div style={{marginRight: '100px'}}>
                            <SortUsers 
                                state={this.props.state}
                                handlers={this.props.sortUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />
                            <FilterUsers
                                state={this.props.state} 
                                roleOptions={this.props.roleOptions} 
                                handlers={this.props.filterUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />
                        </div>
                    </div>
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
                            {this.props.state.users.map(function(user) {
                                //If there are no role filters, or the user has one of the filtered roles, show them
                                if(noRoleFilters || user.roles.some(function(role) { return filterRoles[role]; })) {
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
                                }
                            })}
                        </TableBody>
                    </Table>
                </CardText>
            </Card>
        );
    }
});

module.exports = UsersTable;