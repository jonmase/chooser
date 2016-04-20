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

    render: function() {
        var props = this.props;
        var filterRoles = this.props.state.filterRoles;
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
                >
                    <div style={{float: 'right'}}>
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
                        <AddUser 
                            state={this.props.state} 
                            roleOptions={this.props.roleOptions} 
                            handlers={this.props.addUserHandlers} 
                        />
                        <EditSelectedUsers
                            state={this.props.state} 
                            roleOptions={this.props.roleOptions} 
                            handlers={this.props.editSelectedUsersHandlers} 
                        />
                        {/*<UsersActionMenu
                        
                        />*/}
                    </div>
                </CardHeader>
                <CardText 
                    //expandable={true}
                    style={{paddingTop: '0'}}
                >
                    {/*<div style={{width: '100%', minHeight: '60px', marginBottom: '20px'}}>
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
                    </div>*/}
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
                                <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody 
                            //displayRowCheckbox={false}
                            deselectOnClickaway={false}
                        >
                            {this.props.state.users.map(function(user) {
                                //If there are no role filters, or the user has one of the filtered roles, show them
                                if(filterRoles.length === 0 || user.roles.some(function(role) { 
                                    return filterRoles.indexOf(role) > -1; 
                                })) {
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
                                            <TableRowColumn style={styles.actionsTableRowColumn}>
                                                <EditUser
                                                    handlers={props.editUserHandlers} 
                                                />
                                            </TableRowColumn>
                                        </TableRow>
                                    );
                                }
                            })}
                        </TableBody>
                    </Table>
                    <EditUserDialog 
                        state={props.state} 
                        roleOptions={props.roleOptions} 
                        handlers={props.editUserHandlers} 
                    />
                </CardText>
            </Card>
        );
    }
});

module.exports = UsersTable;